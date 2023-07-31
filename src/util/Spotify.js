
let accessToken;
const clientId = process.env.REACT_APP_API_KEY
// let redirectURI = "http://localhost:3000/";
// let redirectURI = "http://JammingYoutube.surge.sh";
let redirectURI = "https://main--resplendent-panda-4be0dc.netlify.app/";

export const Spotify ={
    getAccessToken(){
    if(accessToken){
        return accessToken;
    }
    const accessTokenMatch =  window.location.href.match(/access_token=([^&]*)/);
    const expirationMatch = window.location.href.match(/expires_in=([^&]*)/)
   
    if(accessTokenMatch && expirationMatch){
        accessToken = accessTokenMatch[1];
        const expiresIn= Number(expirationMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken
    }
    else{
        
    const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
    window.location = accessURL;
    
    }
    },

    search(term){
        const accessToken = Spotify.getAccessToken()
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
            headers: {Authorization: `Bearer ${accessToken}`}
        }
        ).then((response)=>{
            return response.json()
        }).then((jsonResponse)=>{
    
            if(!jsonResponse.tracks){
                alert('Search for it')
                return [];
            }
            return jsonResponse.tracks.items.map((track)=>({
            id : track.id,
            name : track.name,
            artist :track.artists[0].name,
            album :track.album.name,
            uri :track.uri
            }))
        })
       

    },
    savePlaylist(name,trackURIs){
        if(!name && !trackURIs.length){
           return 
        }
        const accessToken = this.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;
        return fetch(`https://api.spotify.com/v1/me`,{headers:headers}
        ).then((response)=>response.json()
        ).then((jsonResponse)=>{
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                headers:headers,
                method:"POST",
                body:JSON.stringify({name:name})
            }).then((response)=>
                response.json()
                ).then((jsonResponse)=>{
                const playlistID = jsonResponse.id
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
                method:'POST',
                headers:headers,
                body:JSON.stringify({uris:trackURIs})
            })
            })
        })
    
            

  
        
    }
    

}
export default Spotify;