<div align="center">
<h1>Lynx</h1>
<p>Create short links with ease.</p>
<p>API & Web App</p>
</div>

## API

The API is available at `/api/create`.

### How it works

First, you will need to provide a URL to shorten. As an example, let's use:

```
https://example.org
```

Now, you can make a post request to the API. I'll use `curl` for this example:

```bash
curl -X POST http://lynx.gxbs.dev/api/create   -H "Content-Type: application/json"   -d '{"originalUrl": "https://example.org"}'
```

The response will be a JSON object with the shortened URL:

```json
{
  "shortUrl": "http://lynx.gxbs.dev/N7uf"
}
```

The `N7uf` part is the unique identifier for the URL. It's generated randomly, and it's always 4 characters long.

With that, you can now access the original URL by visiting the shortened URL.

#### How it stores the data

This is the fun part, it creates an entry in a JSON file, where the API stores the original URL and the unique identifier. The JSON file is only available for the API, and it's not accessible from the web. That way, the data is securly stored.

### Development

To run the API locally, you will need to have Deno installed, and the repository cloned.

The API will automatically start, when you run the following command:

```bash
deno task start
```

The API will be available at `https://lynx.gxbs.dev`.

## Web App

The web app is available at `/`.

### How it works

The web app is a simple form-like style where you can input the URL you want to shorten.

First, you will see a welcome screen, where it will tell you about the project, and the first step to shorten a URL.

After you input the URL, you will click "Next" and it will get you to the next screen, the "My Short Links" screen.

The "My Short Links" screen provides a list of all the URLs you have shortened. It will show the original URL, the shortened URL, and a button to remove the URL from the list.

You will also have the option to shorten another URL, by clicking the "Add Short Link" button.

All the Webapp does is use the API, and save the shortened URLs in the local storage of your browser.

### Development

To run the web app locally, you will need to have Deno installed, and the repository cloned.

The web app will automatically start, when you run the following command:

```bash
deno task start
```

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.
