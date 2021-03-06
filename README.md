# GatherGamers-Client

## CREW
| name | role |
|------|------|
| Adrien Masson | **Client-side** : creating the screens |
| Antoine Nivoy | **Client-side** : client->server connexion |
| Maxime Gouénard | **Both sides** : API routes + client->server connexions |
| Pierre Hérissé | **Server side** : Database + API Routes |

## SETUP

- You will need to create **./secretenv.js** file at root path, containing a Google Map API like this :

```javascript
export default {
    MAPS_API_KEY: "your_maps_api_key"
}
```


## TODOS

🆗 : Done | ⭐ : High priority | 🚫 : Low priority

| Feature | Status | Notes | Affected to | MVP |
|---------|--------|-------|------------|-----|
| **Register** | ✅ | Done | Antoine | 🆗 |
| **Registered mail** | ✅ | Done | Maxime | 🆗 |
| **Logout** | ✅ | Done | Antoine | 🆗 |
| **Login** | ✅ | Done | Antoine | 🆗 |
| **Format dates** | ✅ | Done | Antoine | 🆗 |
| **Refacto Geoloc** | ✅ | Done | Pierre | 🆗 |
| **List games** | ✅ | Done | Antoine | 🆗 |
| **Get game details** | ✅ | Done | Adrien | 🆗 |
| **Add a game to favorite** | ✅ | Done | Adrien | 🆗 |
| **Create an event** | ✅ | Done | Adrien | 🆗 |
| **Join an event** | ✅ | Done | Antoine | 🆗 |
| **Subscribe event** | ✅ | Done | Pierre | 🆗 |
| **Show my profile** | ✅ | Done | Adrien | 🆗 |
| **Edit my profile** | ✅ | Done | Adrien | 🆗 |
| **My News** | ✅ | Done | Adrien | 🆗 |
| **My events** | ✅ | Done | Adrien | 🆗 |
| **My favorites** | ✅ | Done | Adrien | 🆗 |
| **Event Geolocalisation** | ✅ | Done | Pierre | 🆗 |
| **Gamers Geolocalisation** | ✅ | Done | Pierre | 🆗 |
| **OptinGeoloc Switch** | ✅ | Done | Pierre | 🆗 |
| **AWS service** | ✅ | Done | Maxime | 🆗 |

## Future features

| Feature | Status | Notes | Affected to | MVP |
|---------|--------|-------|------------|-----|
| **Forum** | ❌ | Not started | | 🚫 |
| **Chat** | ❌ | Not started | | 🚫 |
| **Find better games API** | ❌ | Not started | | 🚫 |
| **Starting Loader & Fetcher** | ❌ | Not started | | 🚫 |
| **CRUD events** | ❌ | Not started | | 🚫 |
| **CRUD friends** | ❌ | Not started | | 🚫 |


## Blocking points :

- **SendGrid** : struggled to configure and authorize our calls
   - **RESOLVED** : now using **_Mailgun_** services, for our 4 authorized mail adresses
- **AWS** : using AWS ElasticCache but still struggling to configue
