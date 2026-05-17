import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Home, UserPlus, Phone, Mail, CheckCircle, XCircle, CalendarCheck, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type Room = Tables<'rooms'>;

interface Attendance {
  id: string;
  profile_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
}

interface StudentWithRoom extends Profile {
  rooms: Room | null;
}

export default function AdminStudents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, signOut, loading: authLoading } = useAuth();
  
  const [students, setStudents] = useState<StudentWithRoom[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // New student form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      navigate('/admin/auth');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch students with their room info
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('*, rooms(*)')
        .order('created_at', { ascending: false });

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);

      // Fetch attendance for selected date
      await fetchAttendance(selectedDate);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date);

      if (error) throw error;
      setAttendance((data as Attendance[]) || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchAttendance(date);
  };

  const handleMarkAttendance = async (profileId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    try {
      const existingAttendance = attendance.find(a => a.profile_id === profileId);
      
      if (existingAttendance) {
        // Update existing
        const { error } = await supabase
          .from('attendance')
          .update({ 
            status, 
            check_in_time: status === 'present' || status === 'late' ? new Date().toTimeString().split(' ')[0] : null 
          })
          .eq('id', existingAttendance.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('attendance')
          .insert({
            profile_id: profileId,
            date: selectedDate,
            status,
            check_in_time: status === 'present' || status === 'late' ? new Date().toTimeString().split(' ')[0] : null,
          });

        if (error) throw error;
      }

      toast({
        title: 'Attendance Marked',
        description: `Student marked as ${status}.`,
      });

      fetchAttendance(selectedDate);
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark attendance.',
        variant: 'destructive',
      });
    }
  };

  const getStudentAttendance = (profileId: string) => {
    return attendance.find(a => a.profile_id === profileId);
  };

  const getAttendanceStats = () => {
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const leave = attendance.filter(a => a.status === 'leave').length;
    return { present, absent, late, leave };
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      toast({
        title: 'Error',
        description: 'Please select a room.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create profile without user_id (admin is adding this student)
      const { error: profileError } = await supabase.from('profiles').insert({
        student_name: newName,
        phone_number: newPhone,
        email: newEmail || null,
        room_id: selectedRoom,
      });

      if (profileError) throw profileError;

      // Update room availability
      await supabase
        .from('rooms')
        .update({ is_available: false })
        .eq('id', selectedRoom);

      toast({
        title: 'Student Added',
        description: 'Student has been successfully added.',
      });

      setDialogOpen(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setSelectedRoom('');
      fetchData();
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignRoom = async (profileId: string, roomId: string | null, oldRoomId: string | null) => {
    try {
      // Update profile with new room
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ room_id: roomId })
        .eq('id', profileId);

      if (profileError) throw profileError;

      // Mark old room as available
      if (oldRoomId) {
        await supabase
          .from('rooms')
          .update({ is_available: true })
          .eq('id', oldRoomId);
      }

      // Mark new room as unavailable
      if (roomId) {
        await supabase
          .from('rooms')
          .update({ is_available: false })
          .eq('id', roomId);
      }

      toast({
        title: 'Room Updated',
        description: 'Room assignment has been updated.',
      });

      fetchData();
    } catch (error: any) {
      console.error('Error updating room:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update room.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const availableRooms = rooms.filter(r => r.is_available);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
              <p className="text-muted-foreground">Manage students and room assignments</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Add a new student and assign them a room.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="student@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assign Room</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.room_number} (Capacity: {room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Student
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold">{students.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span className="text-2xl font-bold">{availableRooms.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-2xl font-bold">{getAttendanceStats().present}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Occupied Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-amber-600" />
                  <span className="text-2xl font-bold">{rooms.length - availableRooms.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>All registered students and their room assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.student_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {student.phone_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.email ? (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {student.email}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.rooms ? (
                          <Badge variant="secondary">Room {student.rooms.room_number}</Badge>
                        ) : (
                          <Badge variant="outline">Unassigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.user_id ? (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Registered</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={student.room_id || ''}
                          onValueChange={(value) => handleAssignRoom(student.id, value === 'unassign' ? null : value, student.room_id)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Assign room" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassign">Unassign</SelectItem>
                            {rooms
                              .filter(r => r.is_available || r.id === student.room_id)
                              .map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  Room {room.room_number}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No students registered yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Attendance Section */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5" />
                    Attendance Management
                  </CardTitle>
                  <CardDescription>Mark and view student attendance</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const studentAttendance = getStudentAttendance(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.student_name}</TableCell>
                        <TableCell>
                          {student.rooms ? (
                            <Badge variant="secondary">Room {student.rooms.room_number}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {studentAttendance ? (
                            <Badge
                              variant={
                                studentAttendance.status === 'present' ? 'default' :
                                studentAttendance.status === 'late' ? 'secondary' :
                                studentAttendance.status === 'leave' ? 'outline' : 'destructive'
                              }
                              className={
                                studentAttendance.status === 'present' ? 'bg-emerald-500' :
                                studentAttendance.status === 'late' ? 'bg-amber-500' :
                                studentAttendance.status === 'absent' ? 'bg-red-500 text-white' : ''
                              }
                            >
                              {studentAttendance.status.charAt(0).toUpperCase() + studentAttendance.status.slice(1)}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Marked</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {studentAttendance?.check_in_time || '—'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                              className="h-7 text-xs"
                              onClick={() => handleMarkAttendance(student.id, 'present')}
                            >
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'absent' ? 'destructive' : 'outline'}
                              className="h-7 text-xs"
                              onClick={() => handleMarkAttendance(student.id, 'absent')}
                            >
                              Absent
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'late' ? 'secondary' : 'outline'}
                              className="h-7 text-xs"
                              onClick={() => handleMarkAttendance(student.id, 'late')}
                            >
                              Late
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'leave' ? 'secondary' : 'outline'}
                              className="h-7 text-xs"
                              onClick={() => handleMarkAttendance(student.id, 'leave')}
                            >
                              Leave
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No students registered yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Rooms Overview */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Room Availability</CardTitle>
              <CardDescription>Overview of all rooms and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-lg border-2 text-center ${
                      room.is_available
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
                        : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
                    }`}
                  >
                    <Home className={`w-6 h-6 mx-auto mb-2 ${
                      room.is_available ? 'text-emerald-600' : 'text-amber-600'
                    }`} />
                    <p className="font-semibold">Room {room.room_number}</p>
                    <p className="text-xs text-muted-foreground">Capacity: {room.capacity}</p>
                    <Badge
                      variant={room.is_available ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {room.is_available ? 'Available' : 'Occupied'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
