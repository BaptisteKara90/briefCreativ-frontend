//handle likes on creations and post them to db
const handleLikeLike = (creationId, prevCreations, token) => {
  return new Promise( async (resolve, reject) => {
    
    try {
      //console.log(user.token)
      const response = await fetch(`https://brief-creativ-backend.vercel.app/briefs/creationsLikes/${creationId}/like`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });
      
      if (!response.ok) {
        //throw new Error('Erreur lors de la mise à jour des likes');
        console.log("Response",response);
        // afficher modal si pas connecté
      }
      else {
        const data = await response.json();
        
          if(data) {
                    
            const retourLikes = prevCreations.map(creation => {
                if (creation._id === creationId) {
                    return {
                        ...creation,
                        like: data.likes
                    };
                }
                return creation;
            });
           console.log("Créations like Tab",retourLikes)
            return { creations: retourLikes, retour: true }
          }
          else {
            return { retour: false }
          }
      }

    } catch (err) {
      console.error(err.message);
    }
  }) 
  };

  export default handleLikeLike;