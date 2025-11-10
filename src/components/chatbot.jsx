import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import RobotIcon from './robot-icon';
import { trackEvent } from '../utils/analytics';
import { logger } from '../utils/logger';
import { API_URLS, EXAMPLE_QUESTIONS, CHAT_CONFIG } from '../constants/chatbot';

// Speech synthesis configuration constants
const SPEECH_CONFIG = {
    rate: 0.92,    // Slower pace = more natural and easier to understand
    pitch: 0.95,   // Slightly lower pitch = less robotic, more human
    volume: 1.0
};

// Timing constants (in milliseconds)
const TIMING = {
    EXAMPLE_SUBMIT_DELAY: 0,   // Immediate submit for example questions
    VOICE_SUBMIT_DELAY: 500    // Brief delay to show transcription before auto-submit
};

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const isMountedRef = useRef(true);
    const speechSynthesisRef = useRef(null);
    const speechRecognitionRef = useRef(null);

    // Memoize the preferred voice selection for performance
    const preferredVoice = useMemo(() => {
        if (!('speechSynthesis' in window)) return null;

        const voices = window.speechSynthesis.getVoices();

        // Priority order for most human-sounding voices
        return (
            // Top tier: Google UK/US voices (most natural)
            voices.find(voice =>
                voice.lang.startsWith('en') &&
                voice.name.includes('Google') &&
                (voice.name.includes('UK') || voice.name.includes('US'))
            ) ||
            // macOS: Samantha (very natural female voice)
            voices.find(voice => voice.name.includes('Samantha')) ||
            // Windows: Microsoft neural voices
            voices.find(voice =>
                voice.lang.startsWith('en') &&
                (voice.name.includes('Natural') || voice.name.includes('Neural'))
            ) ||
            // macOS: Other enhanced voices
            voices.find(voice =>
                voice.lang.startsWith('en') &&
                (voice.name.includes('Enhanced') || voice.name.includes('Premium'))
            ) ||
            // Fallback: Any English voice
            voices.find(voice => voice.lang.startsWith('en-US')) ||
            voices.find(voice => voice.lang.startsWith('en'))
        );
    }, []);

    // Memoize API URL to avoid re-computing on every form submission
    const apiUrl = useMemo(() =>
        window.location.hostname === 'localhost'
            ? API_URLS.development
            : API_URLS.production,
        []
    );

    useEffect(() => {
        // Load voices on mount (some browsers require this)
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }

        return () => {
            isMountedRef.current = false;
            // Stop any ongoing speech when component unmounts
            if (speechSynthesisRef.current) {
                window.speechSynthesis.cancel();
            }
            // Stop any ongoing speech recognition
            if (speechRecognitionRef.current) {
                speechRecognitionRef.current.stop();
            }
        };
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        // Only scroll if there are messages
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => {
            const newState = !prev;
            trackEvent('Chatbot', 'Toggle Fullscreen', newState ? 'Enter' : 'Exit');
            return newState;
        });
    }, []);

    const handleInputChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, []);

    const handleSubmit = useCallback(async (e, questionOverride = null) => {
        e.preventDefault();

        const message = (questionOverride || inputValue).trim();
        if (!message || isLoading) return;

        trackEvent('Chatbot', 'Message Sent', 'User Query');

        // Add user message with unique ID
        const userMessage = {
            role: 'user',
            content: message,
            id: `${Date.now()}-${Math.random()}`
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Add empty assistant message with unique ID
        const assistantMessage = {
            role: 'assistant',
            content: '',
            id: `${Date.now()}-${Math.random()}-assistant`
        };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                // Update the last message with the new chunk - FIX: Create new message object
                if (isMountedRef.current) {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessageIndex = newMessages.length - 1;
                        newMessages[lastMessageIndex] = {
                            ...newMessages[lastMessageIndex],
                            content: newMessages[lastMessageIndex].content + chunk
                        };
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            logger.error('Chatbot error:', error);
            if (isMountedRef.current) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessageIndex = newMessages.length - 1;
                    newMessages[lastMessageIndex] = {
                        ...newMessages[lastMessageIndex],
                        content: CHAT_CONFIG.errorMessage
                    };
                    return newMessages;
                });
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [inputValue, isLoading, apiUrl]);

    const handleExampleClick = useCallback((question) => {
        trackEvent('Chatbot', 'Example Question Click', question);
        setInputValue(question);
        // Trigger submit with the question
        setTimeout(() => {
            const event = { preventDefault: () => {} };
            handleSubmit(event, question);
        }, TIMING.EXAMPLE_SUBMIT_DELAY);
    }, [handleSubmit]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);

    const handleSpeak = useCallback((messageId, text) => {
        // Check if browser supports speech synthesis
        if (!('speechSynthesis' in window)) {
            alert('Sorry, your browser does not support text-to-speech.');
            return;
        }

        // If already speaking this message, stop it
        if (speakingMessageId === messageId) {
            window.speechSynthesis.cancel();
            setSpeakingMessageId(null);
            speechSynthesisRef.current = null;
            trackEvent('Chatbot', 'TTS Stop', 'User Action');
            return;
        }

        // If speaking another message, stop it first
        if (speakingMessageId) {
            window.speechSynthesis.cancel();
        }

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);

        // Use the memoized preferred voice
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Fine-tuned parameters for more natural, conversational speech
        utterance.rate = SPEECH_CONFIG.rate;
        utterance.pitch = SPEECH_CONFIG.pitch;
        utterance.volume = SPEECH_CONFIG.volume;

        // Handle end of speech
        utterance.onend = () => {
            if (isMountedRef.current) {
                setSpeakingMessageId(null);
                speechSynthesisRef.current = null;
            }
        };

        // Handle errors
        utterance.onerror = (event) => {
            logger.error('Speech synthesis error:', event);
            if (isMountedRef.current) {
                setSpeakingMessageId(null);
                speechSynthesisRef.current = null;
            }
        };

        speechSynthesisRef.current = utterance;
        setSpeakingMessageId(messageId);
        window.speechSynthesis.speak(utterance);
        trackEvent('Chatbot', 'TTS Start', 'User Action');
    }, [speakingMessageId, preferredVoice]);

    const handleVoiceInput = useCallback(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Sorry, your browser does not support speech recognition. Try using Chrome or Edge.');
            return;
        }

        // If already listening, stop
        if (isListening && speechRecognitionRef.current) {
            speechRecognitionRef.current.stop();
            setIsListening(false);
            trackEvent('Chatbot', 'Voice Input Stop', 'User Action');
            return;
        }

        // Create new recognition instance
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            if (isMountedRef.current) {
                setIsListening(true);
                trackEvent('Chatbot', 'Voice Input Start', 'User Action');
            }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (isMountedRef.current) {
                setInputValue(transcript);
                trackEvent('Chatbot', 'Voice Input Success', transcript);

                // Auto-submit the question after a brief delay to show the transcription
                setTimeout(() => {
                    const submitEvent = { preventDefault: () => {} };
                    handleSubmit(submitEvent, transcript);
                }, TIMING.VOICE_SUBMIT_DELAY);
            }
        };

        recognition.onerror = (event) => {
            logger.error('Speech recognition error:', event.error);
            if (isMountedRef.current) {
                setIsListening(false);
                if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    alert(`Speech recognition error: ${event.error}`);
                }
                trackEvent('Chatbot', 'Voice Input Error', event.error);
            }
        };

        recognition.onend = () => {
            if (isMountedRef.current) {
                setIsListening(false);
            }
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
    }, [isListening, handleSubmit]);

    return (
        <div id="chat-bot" className={`chat-container ${isFullscreen ? 'fullscreen' : ''}`} role="region" aria-label="Interactive chatbot">
            {!isFullscreen && (
                <div className="chat-header">
                    <h2>{CHAT_CONFIG.headerTitle}</h2>
                    <p className="chat-subtitle">{CHAT_CONFIG.headerSubtitle}</p>
                </div>
            )}

            <div className="chat-messages" role="log" aria-live="polite" aria-atomic="false">
                <button
                    className="fullscreen-toggle"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                    {isFullscreen ? '✕' : '⛶'}
                </button>

                {messages.length === 0 && (
                    <div className="welcome-message" role="region" aria-label="Welcome message and example questions">
                        <p>{CHAT_CONFIG.welcomeMessage}</p>

                        <div className="example-questions">
                            <p className="example-label">Try asking:</p>
                            {EXAMPLE_QUESTIONS.map((question) => (
                                <button
                                    key={question}
                                    onClick={() => handleExampleClick(question)}
                                    className="example-question"
                                    aria-label={`Ask: ${question}`}
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message, index) => {
                    const isLastMessage = index === messages.length - 1;
                    const isLoadingMessage = isLastMessage && message.role === 'assistant' && !message.content && isLoading;
                    const isSpeaking = speakingMessageId === message.id;
                    const canSpeak = message.role === 'assistant' && message.content && !isLoadingMessage;

                    return (
                        <div
                            key={message.id}
                            className={`message ${message.role}`}
                            role="article"
                            aria-label={message.role === 'user' ? 'Your message' : 'Assistant response'}
                        >
                            <div className="message-avatar" aria-hidden="true">
                                {message.role === 'user' ? '👤' : <RobotIcon />}
                            </div>

                            {isLoadingMessage && (
                                <div className="loading-spinner" role="status" aria-label="Loading response">
                                    <span className="sr-only">Loading response...</span>
                                </div>
                            )}

                            <div className="message-content">
                                {message.content}
                            </div>

                            {canSpeak && (
                                <button
                                    className={`tts-button ${isSpeaking ? 'speaking' : ''}`}
                                    onClick={() => handleSpeak(message.id, message.content)}
                                    aria-label={isSpeaking ? 'Stop speaking' : 'Read message aloud'}
                                    title={isSpeaking ? 'Stop speaking' : 'Read message aloud'}
                                    aria-pressed={isSpeaking}
                                >
                                    {isSpeaking ? (
                                        <span aria-hidden="true">⏸</span>
                                    ) : (
                                        <img src="/images/speaker.svg" alt="" aria-hidden="true" className="speaker-icon" />
                                    )}
                                </button>
                            )}
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-container" aria-label="Send message">
                <div className="chat-input-wrapper">
                    <textarea
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Ask me about Cory... (Press Enter to send)"
                        className="chat-input"
                        rows="1"
                        disabled={isLoading}
                        onKeyDown={handleKeyDown}
                        aria-label="Chat message input"
                    />

                    <button
                        type="button"
                        className={`chat-voice-input ${isListening ? 'listening' : ''}`}
                        onClick={handleVoiceInput}
                        disabled={isLoading}
                        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                        title={isListening ? 'Stop listening' : 'Speak your question'}
                        aria-pressed={isListening}
                    >
                        {isListening ? '⏹' : <img src="/images/microphone.svg" alt="" aria-hidden="true" className="mic-icon" />}
                    </button>

                    <button
                        type="submit"
                        className="chat-submit"
                        disabled={isLoading || !inputValue.trim()}
                        aria-label={isLoading ? 'Sending message...' : 'Send message'}
                    >
                        <span aria-hidden="true">{isLoading ? '⏳' : '➤'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
