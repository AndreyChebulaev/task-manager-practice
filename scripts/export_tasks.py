import csv
import psycopg2
from psycopg2 import Error

DB_HOST = "localhost"
DB_PORT = "5432"
DB_USER = "postgres"
DB_PASSWORD = "root"  
DB_DATABASE = "task_db"

def export_tasks_to_csv():
    connection = None
    cursor = None
    try:
        connection = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_DATABASE
        )
        
        cursor = connection.cursor()
        
        query = "SELECT id, title, description, status, created_at FROM tasks ORDER BY id ASC;"
        cursor.execute(query)
        
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        
        csv_file_path = "tasks_export.csv"
        with open(csv_file_path, mode="w", newline="", encoding="utf-8-sig") as file:
            writer = csv.writer(file)
            
            writer.writerow(column_names)
            writer.writerows(rows)
            
        print(f"Данные успешно экспортированы в файл: {csv_file_path}")

    except (Exception, Error) as error:
        print("Ошибка при работе с PostgreSQL:", error)
        
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            print("Соединение с базой данных закрыто.")

if __name__ == "__main__":
    export_tasks_to_csv()
