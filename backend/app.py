from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

def connect_db():
    conn = sqlite3.connect('jobs_employees.db')
    return conn

def get_jobs():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM jobs')
    jobs = cursor.fetchall()
    conn.close()
    return jobs

def add_job(job_data):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO jobs (title, description) VALUES (?, ?)', (job_data['title'], job_data['description']))
    conn.commit()
    conn.close()

def get_employees():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM employees')
    employees = cursor.fetchall()
    conn.close()
    return employees

def add_employee(employee_data):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO employees (name, position) VALUES (?, ?)', (employee_data['name'], employee_data['position']))
    conn.commit()
    conn.close()

@app.route('/api/jobs', methods=['GET'])
def api_get_jobs():
    jobs = get_jobs()
    return jsonify({"jobs": jobs})

@app.route('/api/jobs', methods=['POST'])
def api_create_job():
    job_data = request.json
    add_job(job_data)
    return jsonify(job_data), 201

@app.route('/api/employees', methods=['GET'])
def api_get_employees():
    employees = get_employees()
    return jsonify({"employees": employees})

@app.route('/api/employees', methods=['POST'])
def api_create_employee():
    employee_data = request.json
    add_employee(employee_data)
    return jsonify(employee_data), 201

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    total_assets = len(get_jobs()) + len(get_employees())  # Example calculation
    categorized_assets = {
        "available": len(get_jobs()),  # Example count of available jobs
        "repair": 0  # Placeholder for repair count
    }
    pending_repairs = 0  # Placeholder for pending repairs count
    return jsonify({
        "totalAssets": total_assets,
        "categorizedAssets": categorized_assets,
        "pendingRepairs": pending_repairs
    })

if __name__ == '__main__':
    app.run(debug=True)
