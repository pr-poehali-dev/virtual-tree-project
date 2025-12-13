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
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>

              <polygon
                points="200,50 120,180 140,180 90,270 110,270 40,380 360,380 290,270 310,270 260,180 280,180"
                fill="url(#treeGradient)"
                stroke="#0A3D23"
                strokeWidth="3"
                filter="url(#shadow)"
              />

              <rect x="170" y="380" width="60" height="80" fill="#654321" stroke="#4A2F15" strokeWidth="3" rx="5" />

              <polygon points="200,20 210,50 190,50" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />

              {[
                { x: 140, y: 100, color: '#FFD700' },
                { x: 180, y: 105, color: '#DC143C' },
                { x: 220, y: 105, color: '#4169E1' },
                { x: 260, y: 100, color: '#FFD700' },

                { x: 130, y: 140, color: '#DC143C' },
                { x: 165, y: 145, color: '#4169E1' },
                { x: 200, y: 148, color: '#FFD700' },
                { x: 235, y: 145, color: '#DC143C' },
                { x: 270, y: 140, color: '#4169E1' },

                { x: 115, y: 190, color: '#4169E1' },
                { x: 155, y: 195, color: '#FFD700' },
                { x: 200, y: 200, color: '#DC143C' },
                { x: 245, y: 195, color: '#4169E1' },
                { x: 285, y: 190, color: '#FFD700' },

                { x: 100, y: 230, color: '#DC143C' },
                { x: 140, y: 240, color: '#4169E1' },
                { x: 180, y: 245, color: '#FFD700' },
                { x: 220, y: 245, color: '#DC143C' },
                { x: 260, y: 240, color: '#4169E1' },
                { x: 300, y: 230, color: '#FFD700' },

                { x: 80, y: 290, color: '#FFD700' },
                { x: 125, y: 300, color: '#DC143C' },
                { x: 165, y: 310, color: '#4169E1' },
                { x: 200, y: 315, color: '#FFD700' },
                { x: 235, y: 310, color: '#DC143C' },
                { x: 275, y: 300, color: '#4169E1' },
                { x: 320, y: 290, color: '#DC143C' },
              ].map((light, i) => (
                <circle
                  key={`light-${i}`}
                  cx={light.x}
                  cy={light.y}
                  r="3"
                  fill={light.color}
                  className="ornament-sparkle"
                  opacity="0.8"
                />
              ))}

              {[
                { x: 155, y: 115, rx: 200 },
                { x: 245, y: 115, rx: 160 },
                
                { x: 147, y: 160, rx: 240 },
                { x: 217, y: 165, rx: 200 },
                { x: 253, y: 160, rx: 180 },

                { x: 127, y: 210, rx: 280 },
                { x: 177, y: 215, rx: 240 },
                { x: 223, y: 215, rx: 200 },
                { x: 273, y: 210, rx: 160 },

                { x: 110, y: 255, rx: 320 },
                { x: 158, y: 265, rx: 280 },
                { x: 200, y: 270, rx: 240 },
                { x: 242, y: 265, rx: 200 },
                { x: 290, y: 255, rx: 140 },

                { x: 97, y: 320, rx: 360 },
                { x: 143, y: 330, rx: 320 },
                { x: 182, y: 340, rx: 280 },
                { x: 218, y: 340, rx: 240 },
                { x: 257, y: 330, rx: 200 },
                { x: 303, y: 320, rx: 140 },
              ].map((hook, index) => (
                <g key={index}>
                  <line
                    x1={hook.x}
                    y1={hook.y - 8}
                    x2={hook.x}
                    y2={hook.y}
                    stroke="#8B4513"
                    strokeWidth="1.5"
                  />
                  
                  {tracks[index] ? (
                    <g className="ornament-swing cursor-pointer" onClick={() => handleOrnamentClick(index)}>
                      <circle
                        cx={hook.x}
                        cy={hook.y + 10}
                        r="12"
                        fill="#DC143C"
                        stroke="#8B0000"
                        strokeWidth="2"
                        filter="url(#shadow)"
                        className="transition-all duration-300 hover:r-14"
                      />
                      <circle
                        cx={hook.x}
                        cy={hook.y + 6}
                        r="4"
                        fill="#FF6B6B"
                        opacity="0.6"
                      />
                      <g transform={`translate(${hook.x - 6}, ${hook.y + 6})`}>
                        <path d="M 4 4 L 4 10 M 8 2 L 8 10 L 6 12 L 4 10" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </g>
                    </g>
                  ) : (
                    <g className="cursor-pointer opacity-40 hover:opacity-70 transition-opacity" onClick={() => handleOrnamentClick(index)}>
                      <circle
                        cx={hook.x}
                        cy={hook.y + 10}
                        r="12"
                        fill="#F0F0F0"
                        stroke="#D0D0D0"
                        strokeWidth="2"
                        strokeDasharray="2,2"
                      />
                      <g transform={`translate(${hook.x - 5}, ${hook.y + 5})`}>
                        <path d="M 5 0 L 5 10 M 0 5 L 10 5" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                      </g>
                    </g>
                  )}
                </g>
              ))}
            </svg>
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