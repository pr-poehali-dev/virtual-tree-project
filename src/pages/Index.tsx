import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: number;
  name: string;
  reason: string;
}

const Index = () => {
  const [tracks, setTracks] = useState<(Track | null)[]>(Array(24).fill(null));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [trackName, setTrackName] = useState('');
  const [trackReason, setTrackReason] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const newYear = new Date('2026-01-01T00:00:00');
      const difference = newYear.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddTrack = () => {
    if (!trackName.trim()) {
      toast({
        title: 'Укажите название трека',
        variant: 'destructive',
      });
      return;
    }

    if (trackReason.length < 20) {
      toast({
        title: 'История должна быть не менее 20 символов',
        variant: 'destructive',
      });
      return;
    }

    const emptyIndex = tracks.findIndex(t => t === null);
    if (emptyIndex === -1) {
      toast({
        title: 'Все крючки заняты!',
        description: 'Ёлка уже полностью украшена',
        variant: 'destructive',
      });
      return;
    }

    const newTrack: Track = {
      id: Date.now(),
      name: trackName,
      reason: trackReason,
    };

    const newTracks = [...tracks];
    newTracks[emptyIndex] = newTrack;
    setTracks(newTracks);

    toast({
      title: '🎉 Трек добавлен!',
      description: `"${trackName}" теперь украшает ёлку`,
    });

    setTrackName('');
    setTrackReason('');
    setIsAddDialogOpen(false);
  };

  const handleOrnamentClick = (index: number) => {
    if (tracks[index]) {
      setSelectedTrack(tracks[index]);
      setIsViewDialogOpen(true);
    } else {
      setIsAddDialogOpen(true);
    }
  };

  const filledCount = tracks.filter(t => t !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Icon name="Music" size={48} className="text-accent" />
            Музыкальная Ёлка
          </h1>
          <p className="text-lg text-muted-foreground">
            24 трека от сердца к Новому Году
          </p>
        </header>

        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-2 border-secondary shadow-xl animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
                <Icon name="Clock" size={28} className="text-accent" />
                До создания плейлиста осталось
              </h2>
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { value: timeLeft.days, label: 'дней' },
                  { value: timeLeft.hours, label: 'часов' },
                  { value: timeLeft.minutes, label: 'минут' },
                  { value: timeLeft.seconds, label: 'секунд' },
                ].map((item, i) => (
                  <div key={i} className="bg-primary text-primary-foreground rounded-lg p-4 shadow-lg">
                    <div className="text-4xl md:text-5xl font-bold font-mono">{item.value}</div>
                    <div className="text-sm md:text-base mt-1 opacity-90">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg text-lg px-8 py-6"
          >
            <Icon name="Plus" size={24} className="mr-2" />
            Добавить трек на ёлку
          </Button>
        </div>

        <div className="mb-6 text-center">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border-2 border-secondary">
            <span className="text-lg font-semibold text-primary">
              Украшено: {filledCount} / 24
            </span>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative">
            <svg viewBox="0 0 400 500" className="w-full h-auto">
              <defs>
                <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0F5132', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1B7A4C', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              <polygon
                points="200,30 100,150 120,150 70,230 90,230 50,310 350,310 310,230 330,230 280,150 300,150"
                fill="url(#treeGradient)"
                stroke="#0A3D23"
                strokeWidth="2"
              />

              <rect x="175" y="310" width="50" height="60" fill="#654321" stroke="#4A2F15" strokeWidth="2" rx="4" />

              <polygon points="200,10 205,30 195,30" fill="#FFD700" />
            </svg>

            <div className="absolute inset-0">
              {[
                { x: 34, y: 42, row: 1 },
                { x: 50, y: 42, row: 1 },
                { x: 66, y: 42, row: 1 },

                { x: 28, y: 52, row: 2 },
                { x: 42, y: 52, row: 2 },
                { x: 58, y: 52, row: 2 },
                { x: 72, y: 52, row: 2 },

                { x: 22, y: 62, row: 3 },
                { x: 34, y: 62, row: 3 },
                { x: 50, y: 62, row: 3 },
                { x: 66, y: 62, row: 3 },
                { x: 78, y: 62, row: 3 },

                { x: 16, y: 72, row: 4 },
                { x: 28, y: 72, row: 4 },
                { x: 42, y: 72, row: 4 },
                { x: 58, y: 72, row: 4 },
                { x: 72, y: 72, row: 4 },
                { x: 84, y: 72, row: 4 },

                { x: 12, y: 82, row: 5 },
                { x: 24, y: 82, row: 5 },
                { x: 38, y: 82, row: 5 },
                { x: 52, y: 82, row: 5 },
                { x: 66, y: 82, row: 5 },
                { x: 80, y: 82, row: 5 },
              ].map((pos, index) => (
                <button
                  key={index}
                  onClick={() => handleOrnamentClick(index)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-secondary rounded-full"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className="relative group">
                    <div
                      className={`w-8 h-8 rounded-full shadow-lg border-2 transition-all duration-300 ${
                        tracks[index]
                          ? 'bg-accent border-accent/30 ornament-sparkle'
                          : 'bg-white/60 border-muted hover:bg-white/80'
                      }`}
                    >
                      {tracks[index] ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="Music" size={16} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="Plus" size={14} className="text-muted-foreground opacity-60" />
                        </div>
                      )}
                    </div>
                    {tracks[index] && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        <div className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-lg shadow-lg">
                          {tracks[index]?.name}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Music" size={24} className="text-accent" />
              Добавить трек
            </DialogTitle>
            <DialogDescription>
              Поделитесь своим любимым новогодним треком и расскажите почему он особенный
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="trackName">Название трека</Label>
              <Input
                id="trackName"
                placeholder="Например: Jingle Bells"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="trackReason">
                Почему именно этот трек? <span className="text-muted-foreground text-xs">(минимум 20 символов)</span>
              </Label>
              <Textarea
                id="trackReason"
                placeholder="Расскажите свою историю..."
                value={trackReason}
                onChange={(e) => setTrackReason(e.target.value)}
                className="mt-1.5 min-h-[120px]"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {trackReason.length} / 20 символов
              </div>
            </div>
            <Button onClick={handleAddTrack} className="w-full bg-accent hover:bg-accent/90" size="lg">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить на ёлку
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Music" size={24} className="text-accent" />
              {selectedTrack?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Label className="text-base font-semibold">История:</Label>
            <p className="mt-2 text-muted-foreground leading-relaxed">{selectedTrack?.reason}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
