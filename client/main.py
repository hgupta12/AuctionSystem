import socketio

# Create a Socket.IO client instance
sio = socketio.Client()

# Connect to the server
sio.connect('http://localhost:5000')

# Define event handlers
@sio.event
def connect():
    print('Connected to the server')

@sio.event
def disconnect():
    print('Disconnected from the server')

# Start the event loop
sio.wait()
