import requests

url = "https://barcodes-lookup.p.rapidapi.com/"

# querystring = {"query":"9780008108335"}
querystring = {"query":"6151100044739"}
# querystring = {"query":"9988012098"}

headers = {
	"x-rapidapi-key": "ee6b4943bcmsh514f1e849b5f265p127446jsnf0114804cfbf",
	"x-rapidapi-host": "barcodes-lookup.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())