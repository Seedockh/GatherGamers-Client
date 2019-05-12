# GatherGamers-Client

## CREW
| name | role |
|------|------|
| Adrien Masson | **Client-side** : creating the screens |
| Antoine Nivoy | **Client-side** : client->server connexion |
| Maxime Gouénard | **Both sides** : API routes + client->server connexions |
| Pierre Hérissé | **Server side** : Database + API Routes |

## ToDo

🆗 : Done | ⭐ : High priority | 🚫 : Low priority

| Feature | Status | Notes | Affected to | MVP |
|---------|--------|-------|------------|-----|
| **Register** | ✅ | Done | Antoine | 🆗 |
| **Registered mail** | ✅ | Done | Maxime | 🆗 |
| **Logout** | ✅ | Done | Antoine | 🆗 |
| **Login** | ✅ | Done | Antoine | 🆗 |
| **Starting Loader & Fetcher** | ❌ | Not started | | 🚫 |
| **List games** | ✅ | Done | Antoine | 🆗 |
| **Get game details** | ✅ | Done | Adrien | 🆗 |
| **Add a game to favorite** | ✅ | Done | Adrien | 🆗 |
| **Create an event** | ✅ | Done | Adrien | 🆗 |
| **Show events created** | ❌ | Not started | | 🚫 |
| **Update events created** | ❌ | Not started | | 🚫 |
| **Delete events created** | ❌ | Not started | | 🚫 |
| **Join an event** | ✅ | Done | Antoine | 🆗 |
| **(Un)Subscribe event** | ✅ | Done | Pierre | 🆗 |
| **Show my profile** | ✅ | Done | Adrien | 🆗 |
| **Edit my profile** | ⌛ | Not merged to master / Password update problem | Adrien | 🚫 |
| **My News** | ✅ | Done | Adrien | 🆗 |
| **My events** | ✅ | Done | Adrien | 🆗 |
| **My favorites** | ✅ | Done | Adrien | 🆗 |
| **Event Geolocalisation** | ✅ | Done | Pierre | 🆗 |
| **Gamers Geolocalisation** | ✅ | Done | Pierre | 🆗 |
| **OptinGeoloc Switch** | ✅ | Done | Pierre | 🆗 |
| **AWS service** | ⌛ | Not working yet | Maxime | ⭐ |

## Future features

| Feature | Status | Notes | Affected to | MVP |
|---------|--------|-------|------------|-----|
| **Forum** | ❌ | Not started | | 🚫 |
| **Messenger** | ❌ | Not started | | 🚫 |

## Blocking points :

- **SendGrid** : struggled to configure and authorize our calls
   - **RESOLVED** : now using **_Mailgun_** services, for our 4 authorized mail adresses
- **AWS** : using AWS ElasticCache but still struggling to configue
