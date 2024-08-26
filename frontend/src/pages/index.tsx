import { CardWithForm } from "@/components/myUi/card/CardWithForm";
import styles from '../styles/card.module.css'

export default function Home({ setIdApp, className, setIdUser }: {className: string, setIdApp: any, setIdUser: any}) {
  return (
    <div className={`${styles.card} ${className}`}>
      <CardWithForm setIdApp={setIdApp} setIdUser={setIdUser}></CardWithForm>
    </div>
  );
}
