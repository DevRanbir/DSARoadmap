import { redirect } from 'next/navigation';

export default function UserPage({ params }: { params: { userName: string } }) {
  redirect(`/${params.userName}/progress`);
}
