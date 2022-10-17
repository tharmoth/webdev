from flask import Flask, request
import csv

api = Flask(__name__)

@api.route('/profile')
def my_profile():

    response_body = {}

    with open('data.csv', newline='') as csv_file:
        data_reader = csv.reader(csv_file, delimiter=',')
        for row in data_reader:
            response_body[row[0]] = row[1]

    return response_body
    
@api.route('/process', methods=["POST"])
def process():
    name = request.json["name"]
    value = str(request.json["value"]).upper()
    print(name + " " + value)

    rows = []

    with open('data.csv', newline='') as csv_file:
        data_reader = csv.reader(csv_file, delimiter=',')
        for row in data_reader:
            if (row[0] == name):
                row[1] = value
                rows.append(row)
            else:
                rows.append(row)
                
    with open('data.csv', 'w', newline='') as csv_file:     
        writer = csv.writer(csv_file)
    
        for row in rows:
            writer.writerow(row)
    
    response_body = {
        "status_code" : 200
    }
    
    return response_body