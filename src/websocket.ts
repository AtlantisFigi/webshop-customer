import { Client, IMessage } from "@stomp/stompjs";

class WebSocketService {
    private client: Client;
    private subscriptions: Map<string, (message: any) => void>;

    constructor(brokerUrl: string) {
        this.client = new Client({
            brokerURL: brokerUrl, // Make sure this is pointing to the correct WebSocket endpoint
            reconnectDelay: 5000, // Automatically reconnect
            debug: (str: string) => {
                console.log("WebSocket Debug:", str); // Debug messages for WebSocket connection
            },
            webSocketFactory: () => new WebSocket(brokerUrl), // This creates a WebSocket connection directly (no SockJS)
        });

        this.subscriptions = new Map();

        this.client.onConnect = () => {
            console.log("Connected to WebSocket server!");
            this.resubscribeAll();
        };

        this.client.onDisconnect = () => {
            console.log("Disconnected from WebSocket server.");
        };
    }

    connect(): void {
        this.client.activate(); // Activate the connection
    }

    disconnect(): void {
        this.client.deactivate(); // Deactivate the connection
    }

    subscribe(destination: string, callback: (message: any) => void): void {
        if (!this.client.connected) {
            console.warn("WebSocket client is not connected. Delaying subscription.");
            this.subscriptions.set(destination, callback); // Save the callback for later subscription
            return;
        }

        const subscription = this.client.subscribe(destination, (message: IMessage) => {
            const parsedMessage = JSON.parse(message.body);
            callback(parsedMessage);
        });

        this.subscriptions.set(destination, () => subscription.unsubscribe()); // Save unsubscribe function
    }

    unsubscribe(destination: string): void {
        const unsubscribeFn = this.subscriptions.get(destination);
        if (unsubscribeFn) {
            unsubscribeFn(); // Unsubscribe from STOMP
            this.subscriptions.delete(destination);
        }
    }

    private resubscribeAll(): void {
        // Resubscribe to all saved subscriptions when reconnecting
        this.subscriptions.forEach((callback, destination) => {
            this.subscribe(destination, callback);
        });
    }
}

export const websocketService = new WebSocketService("ws://localhost:8080/ws");
