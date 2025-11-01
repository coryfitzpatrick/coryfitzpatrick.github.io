import React from 'react';
import { NavLink } from 'react-router-dom';
import RobotIcon from './robot-icon';

export default class ChatbotPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            inputValue: '',
            isLoading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleExampleClick = this.handleExampleClick.bind(this);
        this.messagesEndRef = React.createRef();
    }

    handleExampleClick(question) {
        this.setState({ inputValue: question }, () => {
            // Submit the form after state is updated
            this.handleSubmit({ preventDefault: () => {} });
        });
    }

    scrollToBottom() {
        this.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.messages.length !== this.state.messages.length) {
            this.scrollToBottom();
        }
    }

    handleInputChange(e) {
        this.setState({ inputValue: e.target.value });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const message = this.state.inputValue.trim();
        if (!message || this.state.isLoading) return;

        // Add user message to chat
        const userMessage = { role: 'user', content: message };
        this.setState(prevState => ({
            messages: [...prevState.messages, userMessage],
            inputValue: '',
            isLoading: true
        }));

        // Add empty assistant message that we'll populate
        const assistantMessage = { role: 'assistant', content: '' };
        this.setState(prevState => ({
            messages: [...prevState.messages, assistantMessage]
        }));

        try {
            // Use localhost for local development, production URL otherwise
            const apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:8000/api/chat/stream'
                : 'https://coryfitzpatrick-ai-backend-fcwbtvbnfa-uc.a.run.app/api/chat/stream';

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

                // Update the last message with the new chunk
                this.setState(prevState => {
                    const messages = [...prevState.messages];
                    const lastMessage = messages[messages.length - 1];
                    lastMessage.content += chunk;
                    return { messages };
                });
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState(prevState => {
                const messages = [...prevState.messages];
                const lastMessage = messages[messages.length - 1];
                lastMessage.content = 'Sorry, I encountered an error. Please try again.';
                return { messages };
            });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const categories = [
            { name: 'Dev', path: '/dev', image: '/images/dev/vi-1-thumb.jpg' },
            { name: 'Design', path: '/design', image: '/images/design/washed-away-thumb.jpg' },
            { name: 'Photo', path: '/photo', image: '/images/photo/garden-thumb.jpg' }
        ];

        return (
            <div id="content">
                <div class="container">
                    {categories.map(category => (
                        <div key={category.name} className="grid-d-4 grid-t-6 grid-panel">
                            <NavLink to={category.path}>
                                <figure>
                                    <img src={category.image} alt={category.name} />

                                    <figcaption>
                                        <h2>{category.name}</h2>
                                        <div className="view">View</div>
                                    </figcaption>
                                </figure>
                            </NavLink>
                        </div>
                    ))}
                </div>

                <div className="chat-header">
                    <h2>Ask me about Cory's skills and experience</h2>

                    <p className="chat-subtitle">I'm an AI assistant that can help you learn about Cory's technical abilities and work history.</p>
                </div>

                <div className="chat-messages">
                    {this.state.messages.length === 0 && (
                        <div className="welcome-message">
                            <p>Welcome! Ask me anything about Cory's technical skills, work experience, or projects.</p>

                            <div className="example-questions">
                                <p className="example-label">Try asking:</p>

                                <button onClick={() => this.handleExampleClick("What are Cory's technical skills?")} className="example-question">
                                    What are Cory's technical skills?
                                </button>

                                <button onClick={() => this.handleExampleClick("Tell me about Cory's experience at J&J")} className="example-question">
                                    Tell me about Cory's experience at J&J
                                </button>

                                <button onClick={() => this.handleExampleClick("What are Cory's leadership values and approach?")} className="example-question">
                                    What are Cory's leadership values and approach?
                                </button>
                            </div>
                        </div>
                    )}

                    {this.state.messages.map((message, index) => {
                        const isLastMessage = index === this.state.messages.length - 1;
                        const isLoadingMessage = isLastMessage && message.role === 'assistant' && !message.content && this.state.isLoading;

                        return (
                            <div key={index} className={`message ${message.role}`}>
                                <div className="message-avatar">
                                    {message.role === 'user' ? '👤' : <RobotIcon />}
                                </div>

                                {isLoadingMessage && (
                                    <div className="loading-spinner"></div>
                                )}

                                <div className="message-content">
                                    {message.content}
                                </div>
                            </div>
                        );
                    })}

                    <div ref={this.messagesEndRef} />
                </div>

                <form onSubmit={this.handleSubmit} className="chat-input-container">
                    <div className="chat-input-wrapper">
                        <textarea
                            value={this.state.inputValue}
                            onChange={this.handleInputChange}
                            placeholder="Ask me about Cory..."
                            className="chat-input"
                            rows="1"
                            disabled={this.state.isLoading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    this.handleSubmit(e);
                                }
                            }}
                        />

                        <button
                            type="submit"
                            className="chat-submit"
                            disabled={this.state.isLoading || !this.state.inputValue.trim()}
                        >
                            {this.state.isLoading ? '⏳' : '➤'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
