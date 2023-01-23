import User from "../models/User";

//* READ

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserFriends = async (req, res) => {
   try {
        const { id } = req.params;
        const user = await User.findById(id);

    // using promise.all bcos we are making multiple api calls to the DB
        const friends = Promise.all(
            user.friends.map((id) => user.findById(id))
        );
    // formatting in a proper way for the front end by modifying schema b/4 sending back to front end
        const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        }
    );
        res.status(200).json(formattedFriends)
   } catch (err) {
       res.status(404).json({ message: err.message })
   }
}

//* UPDATE

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // The logic below will remove both friends from each others list if 1 person removes the other AND it will add both people as friends once 1 person adds the other.
        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter(id => id !== friendId);
            friend.friends = friend.friends.filter(id => id !== id)
        } else {
            user.friends.push(friendId);
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()
        // after altering the firends list, we get the newly updated list below. (as we did in getUserFriends() above.)
        const friends = Promise.all(
            user.friends.map((id) => user.findById(id))
        );
        const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        }
    );

    res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}