import debugpy

# Allow other machines to connect
debugpy.listen(("0.0.0.0", 5678))  # Use 0.0.0.0 to allow any IP to connect

print("Waiting for debugger attach...")
debugpy.wait_for_client()  # Pause the program until a debugger is attached

# Your application code here
print("Debugger attached. Running application...")
