import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeComplaint, getAIConfidence } from '@/lib/ai-classifier';
import { PriorityBadge, CategoryBadge } from '@/components/ui/badges';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Database } from '@/integrations/supabase/types';

type ComplaintCategory = Database['public']['Enums']['complaint_category'];
type ComplaintPriority = Database['public']['Enums']['complaint_priority'];

export default function NewComplaint() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<{ category: ComplaintCategory; priority: ComplaintPriority; confidence: number } | null>(null);
  const [manualCategory, setManualCategory] = useState<ComplaintCategory | ''>('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/student/auth');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.length > 20) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const result = analyzeComplaint(value);
        const confidence = getAIConfidence(value);
        setAiResult({ ...result, confidence });
        setIsAnalyzing(false);
      }, 500);
    } else {
      setAiResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Error",
        description: "Profile not found. Please try logging in again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const category = manualCategory || aiResult?.category || 'cleanliness';
      const priority = aiResult?.priority || 'medium';

      const { error } = await supabase.from('complaints').insert({
        profile_id: profile.id,
        title,
        description,
        category,
        priority,
        ai_classified: !manualCategory && !!aiResult,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your complaint has been submitted successfully.",
      });

      navigate('/student/complaints');
    } catch (error: any) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit complaint.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="student" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Submit a Complaint</h1>
            <p className="text-muted-foreground">Our AI will analyze and prioritize your issue automatically</p>
          </div>

          <Card className="w-full max-w-2xl mx-auto animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Submit a Complaint
              </CardTitle>
              <CardDescription>
                Describe your issue and our AI will automatically classify its priority and category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Show student info */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{profile?.student_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="ml-2 font-medium">{profile?.phone_number}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief title for your complaint"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={manualCategory} onValueChange={(v) => setManualCategory(v as ComplaintCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your issue in detail. Our AI will analyze it to determine priority..."
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* AI Classification Result */}
                {(isAnalyzing || aiResult) && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 animate-scale-in">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI Classification</span>
                      {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    </div>
                    {aiResult && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Detected Category</span>
                            <CategoryBadge category={aiResult.category} />
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Priority Level</span>
                            <PriorityBadge priority={aiResult.priority} />
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Confidence</span>
                            <span className="text-sm font-medium">{aiResult.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
