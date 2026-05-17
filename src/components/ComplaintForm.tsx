import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeComplaint, getAIConfidence } from '@/lib/ai-classifier';
import { PriorityBadge, CategoryBadge } from '@/components/ui/badges';
import { ComplaintCategory, ComplaintPriority } from '@/types';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComplaintFormProps {
  onSubmit: (complaint: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
  }) => void;
}

export function ComplaintForm({ onSubmit }: ComplaintFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{ category: ComplaintCategory; priority: ComplaintPriority; confidence: number } | null>(null);
  const [manualCategory, setManualCategory] = useState<ComplaintCategory | ''>('');
  const { toast } = useToast();

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.length > 20) {
      setIsAnalyzing(true);
      // Simulate AI processing delay
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a complaint title.",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your issue.",
        variant: "destructive"
      });
      return;
    }

    const category = manualCategory || aiResult?.category || 'cleanliness';
    const priority = aiResult?.priority || 'medium';

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setAiResult(null);
    setManualCategory('');

    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been registered successfully.",
    });
  };

  return (
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

          <div className="space-y-2">
            <Label htmlFor="title">Complaint Title</Label>
            <Input
              id="title"
              placeholder="Brief title for your complaint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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


          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Submit Complaint
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
