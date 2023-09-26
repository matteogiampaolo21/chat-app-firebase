import '../styles/home.css'
export const Home = () => {
    return(
        <main className='home-container'>
            <article>
                <h1>Hello, welcome to the home page!</h1>

                <h2>Firebase Texting App</h2>
                This project uses Firebase to create a texting app. The database and authentication is handled by firebase. This app is fully responsive.

                <h2>Rooms and Contacts</h2>
                Users can create and add people to rooms. If two users are friends, a "contact" is created. Contacts will still save the messages even after removing friends. Both rooms and contacts only show the last 30 messages.

                <h2>Register</h2>
                Once a user registers, they will create a document that contains the following: email, username, friend requests array, and a friends array.

                <h2>Authorization</h2>
                Users cannot view the dashboard or profile page without being logged in. In addition, users that try to access a room or a contact without permission will be redirected to the dashboard.
            </article>
        </main>
    )
}