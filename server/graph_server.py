import rerun as rr
import numpy as np
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Extended mock data for top 100 crypto KOLs
MOCK_NODES = [
    # Founders & CEOs
    {"id": "vitalik.eth", "name": "vitalik.eth", "size": 25, "group": "founder", "followers": 5200000},
    {"id": "cz_binance", "name": "CZ Binance", "size": 24, "group": "founder", "followers": 8100000},
    {"id": "SBF_FTX", "name": "SBF", "size": 20, "group": "founder", "followers": 1200000},
    {"id": "brian_armstrong", "name": "Brian Armstrong", "size": 22, "group": "founder", "followers": 1500000},
    {"id": "cdixon", "name": "Chris Dixon", "size": 21, "group": "investor", "followers": 800000},
    
    # Crypto Researchers & Developers
    {"id": "gakonst", "name": "Georgios Konstantopoulos", "size": 18, "group": "developer", "followers": 150000},
    {"id": "simplyianm", "name": "Ian Macalinao", "size": 17, "group": "developer", "followers": 120000},
    {"id": "0xngmi", "name": "ngmi", "size": 19, "group": "developer", "followers": 180000},
    {"id": "transmissions11", "name": "t11s", "size": 18, "group": "developer", "followers": 160000},
    
    # Crypto Media & Journalists
    {"id": "laurashin", "name": "Laura Shin", "size": 19, "group": "media", "followers": 250000},
    {"id": "coindesk", "name": "CoinDesk", "size": 20, "group": "media", "followers": 2800000},
    {"id": "TheBlock__", "name": "The Block", "size": 19, "group": "media", "followers": 450000},
    
    # DeFi Influencers
    {"id": "cobie", "name": "Cobie", "size": 21, "group": "influencer", "followers": 700000},
    {"id": "DegenSpartan", "name": "DegenSpartan", "size": 20, "group": "influencer", "followers": 350000},
    {"id": "0xMaki", "name": "0xMaki", "size": 19, "group": "founder", "followers": 280000},
    
    # Crypto Analysts
    {"id": "woonomic", "name": "Willy Woo", "size": 20, "group": "analyst", "followers": 450000},
    {"id": "MessariCrypto", "name": "Messari", "size": 19, "group": "analyst", "followers": 350000},
    {"id": "RyanWatkins_", "name": "Ryan Watkins", "size": 18, "group": "analyst", "followers": 280000},
    
    # NFT/Gaming
    {"id": "punk6529", "name": "punk6529", "size": 20, "group": "influencer", "followers": 420000},
    {"id": "pranksy", "name": "Pranksy", "size": 19, "group": "influencer", "followers": 380000},
    {"id": "beaniemaxi", "name": "Beanie", "size": 18, "group": "influencer", "followers": 320000},
    
    # Technical Analysts
    {"id": "CryptoCapo_", "name": "Crypto Capo", "size": 19, "group": "analyst", "followers": 550000},
    {"id": "SmartContracter", "name": "Bluntz", "size": 18, "group": "analyst", "followers": 420000},
    {"id": "pentosh1", "name": "Pentoshi", "size": 19, "group": "analyst", "followers": 480000}
]

# Generate more realistic connections
MOCK_EDGES = []
# Add connections between nodes based on their groups and influence
for i, node1 in enumerate(MOCK_NODES):
    for j, node2 in enumerate(MOCK_NODES[i+1:], i+1):
        # Create connections with some probability based on node sizes and groups
        if np.random.random() < 0.3:  # 30% chance of connection
            weight = np.random.randint(1, 10)  # Random weight between 1-10
            MOCK_EDGES.append({
                "source": node1["id"],
                "target": node2["id"],
                "weight": weight
            })

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Initialize Rerun
    rr.init("ct_yapper_graph", spawn=True)
    
    try:
        while True:
            # Create graph nodes with more spread out initial positions
            positions = np.random.rand(len(MOCK_NODES), 2) * 200 - 100  # Positions from -100 to 100
            
            # Log nodes with different colors based on group
            for i, node in enumerate(MOCK_NODES):
                color = {
                    "founder": [0.94, 0.5, 0.14],  # Orange
                    "investor": [0.65, 0.55, 0.98],  # Purple
                    "developer": [0.06, 0.73, 0.51],  # Green
                    "media": [0.24, 0.63, 0.95],  # Blue
                    "influencer": [0.95, 0.24, 0.24],  # Red
                    "analyst": [0.95, 0.75, 0.14]  # Yellow
                }.get(node["group"], [0.5, 0.5, 0.5])  # Gray for unknown groups
                
                rr.log(
                    "graph/nodes",
                    rr.Points2D(positions[i:i+1]),
                    rr.TextLog(node["name"]),
                    rr.Color(color),
                    rr.Scalar(node["size"]),
                )
            
            # Log edges with varying thickness based on weight
            for edge in MOCK_EDGES:
                source_idx = next(i for i, n in enumerate(MOCK_NODES) if n["id"] == edge["source"])
                target_idx = next(i for i, n in enumerate(MOCK_NODES) if n["id"] == edge["target"])
                
                rr.log(
                    "graph/edges",
                    rr.LineStrips2D([positions[source_idx], positions[target_idx]]),
                    rr.Color([0.18, 0.22, 0.28, 0.4]),  # Semi-transparent edges
                    rr.Scalar(edge["weight"]),
                )
            
            # Send current positions to the client
            node_positions = {
                node["id"]: positions[i].tolist() 
                for i, node in enumerate(MOCK_NODES)
            }
            await websocket.send_json({
                "positions": node_positions,
                "nodes": MOCK_NODES,  # Send full node data
                "edges": MOCK_EDGES   # Send edge data
            })
            
            # Wait a bit before next update
            await asyncio.sleep(0.1)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 