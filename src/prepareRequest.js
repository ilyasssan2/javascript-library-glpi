const  config = require("./config") 
const  createQueryString = require("./createQueryString") 
const  fetch = require("node-fetch") 

function prepareRequest (data) {

    let myHeaders = new fetch.Headers()
    let myInit = {}
    let url = config.url
    let queryString = null
    let body = {}    

    myHeaders.append('Content-Type', 'application/json')

    if (config.appToken) {
        myHeaders.append('App-Token', config.appToken)
    }
                         
    if (data.queryString) {
        queryString = `?${createQueryString({items: data.queryString})}`
    }

    switch (data.function) {

        case 'initSessionByCredentials': 
            myHeaders.append('Authorization', `Basic ${Buffer.from(`${data.userName}:${data.userPassword}`).toString('base64')}`)
            url = `${url}/initSession`
            myInit = { method: 'GET' }
        break

        case 'initSessionByUserToken': 
            url = `${url}/initSession?user_token=${data.userToken}`
            myInit = { method: 'GET' }
        break

        case 'killSession': 
            url = `${url}/killSession`
            myInit = { method: 'GET' }
        break

        case 'addItem':
            url = `${url}/${data.itemtype}`
            myInit = { 
                method: 'POST',
                body: JSON.stringify({input: data.input})
            }            
        break

        case 'getFullSession':
            url = `${url}/getFullSession`
            myInit = { method: 'GET'}            
        break

        case 'getActiveProfile':
            url = `${url}/getActiveProfile`
            myInit = { method: 'GET'}            
        break

        case 'getMyProfiles':
            url = `${url}/getMyProfiles`
            myInit = { method: 'GET'}            
        break

        case 'getMyEntities':
            url = `${url}/getMyEntities`
            myInit = { method: 'GET'}            
        break

        case 'getActiveEntities':
            url = `${url}/getActiveEntities`
            myInit = { method: 'GET'}            
        break

        case 'getGlpiConfig':
            url = `${url}/getGlpiConfig`
            myInit = { method: 'GET'}            
        break
        
        case 'getAllItems': 
            url = `${url}/${data.itemtype}/${queryString ? queryString : ''}`
            myInit = { method: 'GET' } 
        break

        case 'getAnItem': 
            url = `${url}/${data.itemtype}/${data.id}${queryString ? queryString : ''}`
            myInit = { method: 'GET' } 
        break

        case 'getSubItems': 
            url = `${url}/${data.itemtype}/${data.id}/${data.subItemtype}${queryString ? queryString : ''}`
            myInit = { method: 'GET' } 
        break

        case 'deleteItem': 
            url = `${url}/${data.itemtype}/${data.id ? data.id : ''}${ queryString ? queryString : '' }`
            myInit = { 
                method: 'DELETE',
                body: JSON.stringify({input: data.input})
            } 
        break
        
        case 'updateItem':
            url = `${url}/${data.itemtype}/${data.id ? data.id : ''}`
            myInit = { 
                method: 'PUT',
                body: JSON.stringify({input: data.input})
            } 
        break
        
        case 'changeActiveEntities':
            url = `${url}/changeActiveEntities/`
            body = {}
            if (data.entitiesId) body = {"entities_id": data.entitiesId}
            if (data.isRecursive) body = {...body, "is_recursive": data.isRecursive}
            myInit = { 
                method: 'POST',
                body: JSON.stringify(body)
            } 
        break

        case 'changeActiveProfile':
            url = `${url}/changeActiveProfile/`
            body = {}
            if (data.profilesId) body = {"profiles_id": data.profilesId}
            myInit = { 
                method: 'POST',
                body: JSON.stringify(body)
            } 
        break

        case 'getMultipleItems':
            queryString = `?${createQueryString({items: data.items})}${createQueryString({items: data.options})}`

            url = `${url}/getMultipleItems${queryString}`

            myInit = { method: 'GET' } 
        break

        case 'searchItems':
            queryString = `?${createQueryString({criteria: data.criteria})}${createQueryString({metacriteria: data.metacriteria})}${createQueryString({items: data.options})}`

            url = `${url}/search/${data.itemtype}/${queryString}`

            myInit = { method: 'GET' } 
        break

        case 'listSearchOptions':
            queryString = `?${createQueryString({items: data.queryString})}`

            url = `${url}/listSearchOptions/${data.itemtype}/${queryString}`

            myInit = { method: 'GET' } 
        break

        default:
        break
    }

    if (config.sessionToken) {
        url = `${url}${queryString ? '' : '?'}session_token=${config.sessionToken}`        
    }

    myInit = {
        ...myInit,
        headers: myHeaders
    }
    
    return new fetch.Request(url, myInit)
}

module.exports = prepareRequest
