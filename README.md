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
| **List games** | ✅ | Done | Antoine | 🆗 |
| **Get game details** | ✅ | Done | Adrien | 🆗 |
| **Create an event** | ✅ | Done | Adrien | 🆗 |
| **Join an event** | ✅ | Done | Antoine | 🆗 |
| **Add a game to favorite** | ✅ | Done | Adrien | 🆗 |
| **Show my profile** | ✅ | Done | Adrien | 🆗 |
| **Edit my profile** | ⌛ | Not merged to master / Password update problem | Adrien | 🚫 |
| **Event Geolocalisation** | ✅ | Done | Peter | 🆗 |
| **Gamers Geolocalisation** | ❌ | In progress | | 🚫 |
| **My News** | ✅ | Done | Adrien | 🆗 | 
| **My events** | ✅ | Done | Adrien | 🆗 |
| **My favorites** | ✅ | Done | Adrien | 🆗 |
| **AWS service** | ❌ | Not started | | ⭐ |

## Future features

| Feature | Status | Notes | Affected to | MVP |
|---------|--------|-------|------------|-----|
| **Forum** | ❌ | Not started | | 🚫 |
| **Messenger** | ❌ | Not started | | 🚫 |
| **Starting Loader & Fetcher** | ❌ | Not started | | 🚫 |

## Blocking points :

- **SendGrid** : struggled to configure and authorize our calls
   - **RESOLVED** : now using **_Mailgun_** services, for our 4 authorized mail adresses
