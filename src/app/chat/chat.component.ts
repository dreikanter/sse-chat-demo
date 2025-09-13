import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  username: string = '';
  isLoggedIn: boolean = false;
  messages: Message[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.generateRandomUsername();
  }

  ngOnDestroy() {
    this.disconnect();
  }

  generateRandomUsername() {
    const adjectives = ['Happy', 'Clever', 'Brave', 'Funny', 'Kind', 'Smart', 'Cool', 'Nice'];
    const animals = ['Cat', 'Dog', 'Bird', 'Fish', 'Bear', 'Lion', 'Tiger', 'Fox'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const randomNumber = Math.floor(Math.random() * 100);
    this.username = `${randomAdjective}${randomAnimal}${randomNumber}`;
  }

  login() {
    if (this.username.trim()) {
      this.isLoggedIn = true;
      this.connectToSSE();
    }
  }

  connectToSSE() {
    this.eventSource = new EventSource('http://localhost:3000/events');

    this.eventSource.onopen = () => {
      this.isConnected = true;
    };

    this.eventSource.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      this.messages.push(message);
      this.scrollToBottom();
    };

    this.eventSource.onerror = () => {
      this.isConnected = false;
    };
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageData = {
        username: this.username,
        message: this.newMessage
      };

      this.http.post('http://localhost:3000/message', messageData).subscribe({
        next: () => {
          this.newMessage = '';
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 10);
  }
}