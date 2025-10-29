// import Head from "next/head";
// import Image from "next/image";
import TodoAppMainPage from "@/components/TodoAppMainPage";

export type Task = {
  id: number,
  name: string,
  time: string,
  title: string,
  description: string
}

export type Props = {
  task: Task[]
}

const Home: React.FC<Props> = ({task}) => {
  return (
    <TodoAppMainPage task={task}/>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/task');
  const task: Task = await res.json();

  return {
      props: { task, },
  }
}

export default Home