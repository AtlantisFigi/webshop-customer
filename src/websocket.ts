import { Client, IMessage } from "@stomp/stompjs";

class WebSocketService {
    private client: Client;
    private subscriptions: Map<string, { callback: (message: any) => void, unsubscribe: () => void }>; // Store callback and unsubscribe

    constructor(brokerUrl: string) {
        this.client = new Client({
            brokerURL: brokerUrl,
            reconnectDelay: 5000,
            debug: (str: string) => {
                console.log("WebSocket Debug:", str);
            },
            webSocketFactory: () => new WebSocket(brokerUrl),
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
            // Store both callback and an empty unsubscribe function for later use
            this.subscriptions.set(destination, { callback, unsubscribe: () => {} });
            return;
        }

        const subscription = this.client.subscribe(destination, (message: IMessage) => {
            const parsedMessage = JSON.parse(message.body);
            callback(parsedMessage);
        });

        // Store both callback and unsubscribe method
        this.subscriptions.set(destination, { callback, unsubscribe: () => subscription.unsubscribe() });
    }

    unsubscribe(destination: string): void {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe(); // Unsubscribe using the stored unsubscribe function
            this.subscriptions.delete(destination);
        }
    }

    private resubscribeAll(): void {
        // Resubscribe to all saved subscriptions when reconnecting
        this.subscriptions.forEach((subscription, destination) => {
            // Re-subscribe using the stored callback
            this.subscribe(destination, subscription.callback);
        });
    }
}

export const websocketService = new WebSocketService("ws://localhost:8080/ws");
