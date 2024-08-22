import { CardWithForm } from "@/components/myUi/card/CardWithForm";
import styles from '../styles/card.module.css'

export default function Home({ setIdApp }: {setIdApp: any}) {
  return (
    <div className={styles.card}>
      <CardWithForm setIdApp={setIdApp}></CardWithForm>
    </div>
  );
}
