import mysql.connector

# Connect to the database
try:
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="0000",
        database="worknest"
    )
    mycursor = mydb.cursor()
except mysql.connector.Error as err:
    print(f"Error connecting to database: {err}")
    exit()

# Function to create tables
def fetch_and_print(query):
    try:
        mycursor.execute(query)
        result = mycursor.fetchall()
        for row in result:
            print(row)
    except mysql.connector.Error as err:
        print(f"Error fetching data: {err}")

# Retrieve and print data
print("\nAll Users:")
fetch_and_print("SELECT * FROM worknestusers ")