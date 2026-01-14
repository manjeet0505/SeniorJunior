'use client';

import { useParams } from 'next/navigation';
import ProfilePageClient from '@/components/profile/ProfilePageClient';

export default function UserProfile() {
  const params = useParams();
  const { userId } = params;

  return <ProfilePageClient userId={userId} />;
}
