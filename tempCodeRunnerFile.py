import http.client


with open(".env", 'r') as env:
    all = env.read()

s = all.split("=")

# print(s[1])

conn = http.client.HTTPSConnection("barcodes-lookup.p.rapidapi.com")

headers = {
    'x-rapidapi-key': s[1],
    'x-rapidapi-host': "barcodes-lookup.p.rapidapi.com"
}

conn.request("GET", "/", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))