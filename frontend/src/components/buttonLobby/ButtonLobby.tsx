import Link from "next/link"
import styles from './buttonLobby.module.css'

function ButtonLobby () {
    return (
        <div className={styles.lobby}>
            <Link href={'/'}>LOBBY</Link>
        </div>
    )
}

export default ButtonLobby