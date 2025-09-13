import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faker } from '@faker-js/faker';

interface Message {
  username: string;
  message: string;
  timestamp: string;
  id?: string;
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
  private lastMessageCount: number = 0;
  private lastSentMessageId: string | null = null;

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  ngOnInit() {
    this.generateRandomUsername();
  }

  ngOnDestroy() {
    this.disconnect();
  }

  generateRandomUsername() {
    this.username = faker.internet.username();
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
      this.ngZone.run(() => {
        this.isConnected = true;
      });
    };

    this.eventSource.onmessage = (event) => {
      this.ngZone.run(() => {
        const message: Message = JSON.parse(event.data);
        this.messages.push(message);
        this.lastMessageCount = this.messages.length;
        this.scrollToBottom();
      });
    };

    this.eventSource.onerror = () => {
      this.ngZone.run(() => {
        this.isConnected = false;
      });
    };
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const messageData = {
        username: this.username,
        message: this.newMessage,
        id: messageId
      };

      this.lastSentMessageId = messageId;

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

  isNewMessage(index: number): boolean {
    const message = this.messages[index];
    const isLatest = index === this.messages.length - 1;
    const isFromOtherUser = message.username !== this.username;
    const isNotMySentMessage = message.id !== this.lastSentMessageId;

    return isLatest && isFromOtherUser && isNotMySentMessage && index >= this.lastMessageCount - 1;
  }

  generateMessageByMagic() {
    const sentences = Math.random() > 0.5 ? 2 : 1;
    this.newMessage = faker.lorem.sentences(sentences);
  }

  private scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.border.rounded.p-3.mb-3.bg-light');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 50); // Even faster delay for quicker autoscroll
  }
}