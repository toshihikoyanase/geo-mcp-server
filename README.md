# MCP Geo Server

A minimal MCP server that provides tools such as `getElevation` to interact with geographical data.

## Setup

1. Clone this repository:
   ```bash
   git clone git@github.com:toshihikoyanase/geo-mcp-server.git
   cd geo-mcp-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the server:

```bash
npx ts-node src/index.ts
```

The server will run using standard input/output (stdio).

### Setting Claude Desktop

Add your servers in the `mcpServers` key of Claude Desktop configuration.

```json
{
   "mcpServers": {
      "geo": {
         "command": "npx",
         "args": [
            "ts-node",
            "/absolute/path/to/geo-mcp-server/src/index.ts"
         ]
      }
   }
}
```

## API

### Tool: `getElevation`

**Description**: Fetches elevation data for a given latitude and longitude.

**Input**:
- `lat` (number): Latitude of the location.
- `lon` (number): Longitude of the location.

**Output**:
- Returns the elevation in meters for the specified coordinates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.