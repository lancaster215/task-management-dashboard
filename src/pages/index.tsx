import Dashboard from "@/components/Dashboard";

export type Task = {
  id: number,
  name: string,
  time: string,
  title: string,
  description: string,
  status: string,
  priority: string,
  dueDate: string,
  tags: string,
  createdAt: string,
  action: (string | number),
}

export type Props = {
  task: Task[]
}

const Home: React.FC<Props> = ({task}) => {
  return (
    <Dashboard task={task}/>
  )
}

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/task');
  const task: Task = await res.json();

  return {
    props: { task, },
  }
}

export default Home