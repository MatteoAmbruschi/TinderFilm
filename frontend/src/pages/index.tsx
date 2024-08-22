import { CardWithForm } from "@/components/myUi/card/CardWithForm";
import styles from '../styles/card.module.css'

export default function Home({ setIdApp, className }: {className: string, setIdApp: any}) {
  return (
    <div className={`${styles.card} ${className}`}>
      <CardWithForm setIdApp={setIdApp}></CardWithForm>
    </div>
  );
}
