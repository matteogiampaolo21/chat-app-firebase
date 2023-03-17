import { signOut} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";

export const Dasboard = () => {

    const logOut = async () => {
        try{
            await signOut(auth)
        } catch(err){
            console.error(err)
        }
    }

    useEffect(() => {
        const readDocuments = async () => {
            const docRef = doc(db, "rooms", "jfYMUUMQJndnUN6Hn8MT");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            }
        }
        readDocuments()

    }, []);


    return (
        <div>
            <h2>Hello</h2>
            <button onClick={logOut}>Log Out</button>
        </div>
    )

}