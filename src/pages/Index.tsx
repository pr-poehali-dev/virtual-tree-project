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

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
}

const Index = () => {
  const [tracks, setTracks] = useState<(Track | null)[]>(Array(24).fill(null));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [trackName, setTrackName] = useState('');
  const [trackReason, setTrackReason] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      size: 0.5 + Math.random() * 1,
      delay: Math.random() * 10,
    }));
    setSnowflakes(flakes);
  }, []);

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

    if (trackReason.length > 300) {
      toast({
        title: 'История не должна превышать 300 символов',
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
      title: '✨ Игрушка повешена на ёлку!',
      description: `"${trackName}" теперь украшает нашу ёлку`,
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
  const isTreeComplete = filledCount === 24;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#4A0E0E] via-[#6B1A1A] to-[#8B0000]">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.delay}s`,
            fontSize: `${flake.size}em`,
          }}
        >
          ❄
        </div>
      ))}

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <header className="text-center mb-6 animate-fade-in">
          <div className="mb-4">
            <h1 className="text-6xl md:text-7xl font-bold text-primary mb-2 glow-effect" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
              VIGRY MUSIC
            </h1>
            <p className="text-xl md:text-2xl text-primary/80 font-light tracking-wide">
              Виртуальная Новогодняя Ёлка
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <a
                href="https://t.me/vigrymusic"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-3 bg-primary/20 hover:bg-primary/40 border-2 border-primary/50 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <svg
                  className="w-6 h-6 text-primary glow-effect"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
                <span className="text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Перейти
                </span>
              </a>
              <a
                href="https://vkvideo.ru/@club231661343"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-3 bg-primary/20 hover:bg-primary/40 border-2 border-primary/50 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <svg
                  className="w-6 h-6 text-primary glow-effect"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.745-.576.745z" />
                </svg>
                <span className="text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Перейти
                </span>
              </a>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card className="bg-card/80 backdrop-blur-md border-2 border-primary/30 shadow-2xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Icon name="Clock" size={32} className="text-primary mx-auto mb-3 glow-effect" />
                  <h2 className="text-lg font-bold text-foreground mb-3">
                    До формирования праздничного плейлиста
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: timeLeft.days, label: 'дней' },
                      { value: timeLeft.hours, label: 'часов' },
                      { value: timeLeft.minutes, label: 'минут' },
                    ].map((item, i) => (
                      <div key={i} className="bg-primary/90 text-primary-foreground rounded-lg p-3 shadow-lg">
                        <div className="text-3xl font-bold font-mono">{item.value}</div>
                        <div className="text-xs mt-1 opacity-90">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-card/80 backdrop-blur-md border-2 border-primary/30 shadow-2xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{filledCount}</div>
                  <div className="text-sm text-muted-foreground">из 24 игрушек</div>
                  <div className="w-full bg-muted rounded-full h-3 mt-4">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500 glow-effect"
                      style={{ width: `${(filledCount / 24) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {isTreeComplete && (
              <Card className="mt-6 bg-primary/20 backdrop-blur-md border-2 border-primary shadow-2xl animate-scale-in">
                <CardContent className="pt-6 text-center">
                  <Icon name="Star" size={48} className="text-primary mx-auto mb-3 glow-effect" />
                  <h3 className="text-xl font-bold text-primary mb-2">Ёлка украшена!</h3>
                  <p className="text-sm text-foreground/80">Спасибо за участие! ✨</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="relative">
              <div
                className="rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/30"
                style={{
                  background: `linear-gradient(rgba(74, 14, 14, 0.3), rgba(74, 14, 14, 0.5)), url('https://cdn.poehali.dev/projects/7f96856d-4495-46ee-86d2-045507fa8fd9/files/7492a20c-a559-46d0-ad5d-d3193f1821ac.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '700px',
                }}
              >
                <div className="absolute inset-0">
                  <svg viewBox="0 0 400 700" className="w-full h-full">
                    {[
                      { x: 155, y: 180, angle: -15 },
                      { x: 245, y: 180, angle: 15 },

                      { x: 130, y: 240, angle: -20 },
                      { x: 200, y: 245, angle: 0 },
                      { x: 270, y: 240, angle: 20 },

                      { x: 115, y: 310, angle: -25 },
                      { x: 165, y: 315, angle: -10 },
                      { x: 235, y: 315, angle: 10 },
                      { x: 285, y: 310, angle: 25 },

                      { x: 100, y: 380, angle: -30 },
                      { x: 145, y: 390, angle: -15 },
                      { x: 200, y: 395, angle: 0 },
                      { x: 255, y: 390, angle: 15 },
                      { x: 300, y: 380, angle: 30 },

                      { x: 85, y: 460, angle: -35 },
                      { x: 130, y: 470, angle: -20 },
                      { x: 175, y: 480, angle: -10 },
                      { x: 225, y: 480, angle: 10 },
                      { x: 270, y: 470, angle: 20 },
                      { x: 315, y: 460, angle: 35 },

                      { x: 75, y: 550, angle: -40 },
                      { x: 120, y: 560, angle: -25 },
                      { x: 175, y: 570, angle: -10 },
                      { x: 225, y: 570, angle: 10 },
                      { x: 280, y: 560, angle: 25 },
                      { x: 325, y: 550, angle: 40 },
                    ].map((pos, index) => (
                      <g key={index}>
                        <g
                          className="cursor-pointer transition-transform duration-300 hover:scale-125"
                          onClick={() => handleOrnamentClick(index)}
                          transform={`rotate(${pos.angle}, ${pos.x}, ${pos.y})`}
                        >
                          <line
                            x1={pos.x}
                            y1={pos.y - 15}
                            x2={pos.x}
                            y2={pos.y}
                            stroke="#D4AF37"
                            strokeWidth="2"
                            opacity="0.8"
                          />

                          {tracks[index] ? (
                            <g className="ornament-swing">
                              <defs>
                                <radialGradient id={`ornamentGrad-${index}`}>
                                  <stop offset="0%" stopColor="#FFD700" />
                                  <stop offset="50%" stopColor="#DAA520" />
                                  <stop offset="100%" stopColor="#B8860B" />
                                </radialGradient>
                                <filter id={`ornamentShadow-${index}`}>
                                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.5" />
                                </filter>
                              </defs>
                              <circle
                                cx={pos.x}
                                cy={pos.y + 15}
                                r="18"
                                fill={`url(#ornamentGrad-${index})`}
                                stroke="#8B7500"
                                strokeWidth="2"
                                filter={`url(#ornamentShadow-${index})`}
                                className="ornament-sparkle"
                              />
                              <circle
                                cx={pos.x - 5}
                                cy={pos.y + 10}
                                r="6"
                                fill="rgba(255, 255, 255, 0.4)"
                              />
                              <g transform={`translate(${pos.x - 7}, ${pos.y + 12})`}>
                                <path
                                  d="M 4 2 L 4 10 M 9 0 L 9 10 L 6 13 L 4 10"
                                  stroke="#4A0E0E"
                                  strokeWidth="2"
                                  fill="none"
                                  strokeLinecap="round"
                                />
                              </g>
                            </g>
                          ) : (
                            <g className="opacity-30 hover:opacity-60 transition-opacity">
                              <circle
                                cx={pos.x}
                                cy={pos.y + 15}
                                r="18"
                                fill="rgba(212, 175, 55, 0.2)"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                strokeDasharray="4,4"
                              />
                              <g transform={`translate(${pos.x - 8}, ${pos.y + 7})`}>
                                <path
                                  d="M 8 0 L 8 16 M 0 8 L 16 8"
                                  stroke="#D4AF37"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                />
                              </g>
                            </g>
                          )}
                        </g>

                        {tracks[index] && (
                          <g className="pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                            <rect
                              x={pos.x - 60}
                              y={pos.y + 40}
                              width="120"
                              height="40"
                              rx="8"
                              fill="rgba(74, 14, 14, 0.95)"
                              stroke="#D4AF37"
                              strokeWidth="2"
                            />
                            <text
                              x={pos.x}
                              y={pos.y + 65}
                              textAnchor="middle"
                              fill="#FFD700"
                              fontSize="12"
                              fontWeight="600"
                            >
                              {tracks[index]?.name.length > 15
                                ? tracks[index]?.name.slice(0, 15) + '...'
                                : tracks[index]?.name}
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="text-center mt-6">
                <Button
                  size="lg"
                  onClick={() => setIsAddDialogOpen(true)}
                  disabled={isTreeComplete}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl text-lg px-10 py-7 glow-effect border-2 border-primary/50"
                >
                  <Icon name="Plus" size={24} className="mr-2" />
                  Повесить игрушку
                </Button>
              </div>
            </div>
          </div>
        </div>

        {filledCount > 0 && (
          <Card className="bg-card/80 backdrop-blur-md border-2 border-primary/30 shadow-2xl mb-8">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Icon name="Music" size={28} className="glow-effect" />
                Добавленные треки
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {tracks
                  .filter((t) => t !== null)
                  .map((track, i) => (
                    <div
                      key={track?.id}
                      className="bg-muted/50 rounded-lg p-4 border border-primary/20 hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedTrack(track);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{track?.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{track?.reason}</p>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-primary flex-shrink-0" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card/90 backdrop-blur-md border-2 border-primary/40 shadow-2xl mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="prose prose-lg max-w-none text-foreground space-y-4">
              <h2 className="text-3xl font-bold text-center text-primary mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                🎄 Дорогие друзья! 🎄
              </h2>
              
              <p className="text-center text-lg leading-relaxed">
                Приглашаем вас стать частью музыкального проекта — создайте свою уникальную историю на нашей виртуальной ёлке! ✨
              </p>

              <div className="bg-primary/10 rounded-lg p-6 border border-primary/30 mt-6">
                <p className="font-semibold text-primary mb-3">Этот сайт создан специально для того, чтобы вы могли:</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>поделиться любимой песней — любой, которая дорога вашему сердцу;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>рассказать, почему именно она для вас особенная;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>внести свой вклад в создание общего музыкального плейлиста.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-primary mb-3">🎼 Как это работает:</h3>
                <ol className="space-y-3 list-none">
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</span>
                    <span>Выберите место на виртуальной ёлке, куда хотите «повесить» свою музыкальную игрушку.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</span>
                    <div>
                      <span>Заполните две строчки:</span>
                      <ul className="ml-6 mt-2 space-y-1 list-disc">
                        <li>название трека и исполнителя;</li>
                        <li>небольшой рассказ (от 20 символов) о том, почему эта песня для вас важна.</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</span>
                    <span>Нажмите кнопку «Повесить на ёлку» — и ваша игрушка займёт своё место!</span>
                  </li>
                </ol>
              </div>

              <div className="bg-primary/10 rounded-lg p-6 border border-primary/30 mt-6">
                <h3 className="text-xl font-bold text-primary mb-3">🌟 Что будет дальше:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Все треки и истории будут видны каждому посетителю сайта — можно читать и вдохновляться!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Ёлка постепенно наполнится вашими музыкальными сокровищами.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>1 января 2026 года</strong> я соберу все треки в единый плейлист — наш общий музыкальный альбом! 🎧</span>
                  </li>
                </ul>
              </div>

              <p className="text-center text-lg mt-6 text-muted-foreground">
                ⏳ На сайте вы также увидите обратный отсчёт до 1 января — успевайте добавить свою игрушку, пока на ёлке есть свободные места!
              </p>

              <div className="text-center mt-8 p-6 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-xl border-2 border-primary/50">
                <p className="text-xl font-bold text-primary mb-2">
                  Давайте вместе создадим неповторимую музыкальную коллекцию! 🎶
                </p>
                <p className="text-lg">
                  Ваша песня может стать частью нашей общей истории. ✨
                </p>
              </div>

              <div className="text-center mt-6">
                <p className="text-xl font-semibold text-primary">
                  👉 Жмите «Повесить игрушку» и делитесь своим музыкальным настроением!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-2 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-3xl flex items-center gap-3 text-primary">
              <Icon name="Music" size={32} className="glow-effect" />
              Добавить музыкальную игрушку
            </DialogTitle>
            <DialogDescription className="text-base">
              Поделитесь своим любимым новогодним треком и расскажите, почему он для вас особенный
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div>
              <Label htmlFor="trackName" className="text-base">
                Название трека
              </Label>
              <Input
                id="trackName"
                placeholder="Например: Jingle Bells — Frank Sinatra"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                maxLength={100}
                className="mt-2 bg-input border-primary/30"
              />
              <div className="text-xs text-muted-foreground mt-1">{trackName.length} / 100</div>
            </div>
            <div>
              <Label htmlFor="trackReason" className="text-base">
                Почему этот трек для вас особенный?
                <span className="text-muted-foreground text-sm ml-2">(20-300 символов)</span>
              </Label>
              <Textarea
                id="trackReason"
                placeholder="Расскажите свою историю..."
                value={trackReason}
                onChange={(e) => setTrackReason(e.target.value)}
                maxLength={300}
                className="mt-2 min-h-[140px] bg-input border-primary/30"
              />
              <div className="text-xs text-muted-foreground mt-1">{trackReason.length} / 300 символов</div>
            </div>
            <Button
              onClick={handleAddTrack}
              className="w-full bg-primary hover:bg-primary/90 border-2 border-primary/50 glow-effect"
              size="lg"
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Повесить на ёлку
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-2 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3 text-primary">
              <Icon name="Music" size={28} className="glow-effect" />
              {selectedTrack?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div>
              <Label className="text-base font-semibold text-primary">История трека:</Label>
              <div className="mt-2 p-4 bg-muted/50 rounded-lg border border-primary/20">
                <p className="text-foreground/90 leading-relaxed">{selectedTrack?.reason}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;