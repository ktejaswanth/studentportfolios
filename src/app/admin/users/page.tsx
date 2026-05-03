'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Shield, 
  User as UserIcon,
  Loader2,
  Mail,
  Hash
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UserManagement() {
  const supabase = createClient()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) toast.error('Failed to fetch users')
    else setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleAdmin = async (collegeId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin'
    const { error } = await supabase
      .from('students')
      .update({ role: newRole })
      .eq('college_id', collegeId)

    if (error) toast.error('Update failed')
    else {
      toast.success(`User is now ${newRole}`)
      fetchUsers()
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.college_id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl font-bold font-outfit flex items-center gap-3">
           <Users className="text-primary" />
           Profile Management
        </h1>
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
           <input 
             placeholder="Search by name or ID..." 
             className="input-field pl-12 min-w-[300px]"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="card-premium p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-white/5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                   <th className="px-6 py-4">Student</th>
                   <th className="px-6 py-4">College ID</th>
                   <th className="px-6 py-4">Plan & Validity</th>
                   <th className="px-6 py-4">Account Type</th>
                   <th className="px-6 py-4">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {loading ? (
                   <tr>
                      <td colSpan={5} className="py-20 text-center">
                         <Loader2 className="animate-spin inline-block text-primary" size={32} />
                      </td>
                   </tr>
                ) : filteredUsers.map((u) => (
                   <tr key={u.college_id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            {u.profile_pic_url ? (
                               <img src={u.profile_pic_url} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                            ) : (
                               <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                  <UserIcon size={20} className="text-muted-foreground" />
                               </div>
                            )}
                            <div className="flex flex-col">
                               <span className="font-bold">{u.name}</span>
                               <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail size={12} /> {u.email}
                               </span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">
                         <span className="flex items-center gap-2">
                           <Hash size={14} className="text-primary/50" />
                           {u.college_id}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase w-fit ${u.subscription_status === 'pro' ? 'bg-accent/20 text-accent ring-1 ring-accent/50' : 'bg-white/5 text-muted-foreground'}`}>
                               {u.subscription_status || 'free'}
                            </span>
                            <div className="text-[10px] text-muted-foreground">
                               {u.subscription_activated_at ? new Date(u.subscription_activated_at).toLocaleDateString() : 'N/A'} - {u.subscription_expiry ? new Date(u.subscription_expiry).toLocaleDateString() : 'N/A'}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            {u.role === 'admin' ? (
                               <span className="text-xs font-bold text-accent italic flex items-center gap-1">
                                 <Shield size={14} /> Admin
                               </span>
                            ) : (
                               <span className="text-xs text-muted-foreground">Student</span>
                            )}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-4">
                            <Link href={`/portfolio/${u.college_id}`} target="_blank" className="hover:text-primary transition-colors">
                               <ExternalLink size={18} />
                            </Link>
                            <button 
                              onClick={() => toggleAdmin(u.college_id, u.role)}
                              title={u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              className={`${u.role === 'admin' ? 'text-accent' : 'text-muted-foreground'} hover:text-white transition-colors`}
                            >
                               <Shield size={18} />
                            </button>
                            <button className="text-muted-foreground hover:text-destructive transition-colors">
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
          {!loading && filteredUsers.length === 0 && (
             <div className="py-20 text-center text-muted-foreground italic">
                No profiles found matching your search.
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
