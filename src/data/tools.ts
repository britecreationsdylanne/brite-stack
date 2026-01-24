export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  comingSoon?: boolean;
}

export const tools: Tool[] = [
  {
    id: 'ad-generator',
    name: 'Ad Generator',
    description: 'Whip up scroll-stopping static & animated ads in seconds',
    url: 'https://ad-generator-279545860595.us-central1.run.app/',
    icon: 'megaphone',
  },
  {
    id: 'briteco-brief',
    name: 'BriteCo Brief',
    description: 'Your agent newsletter, brewed fresh monthly',
    url: 'https://briteco-brief-279545860595.us-central1.run.app/',
    icon: 'file-text',
  },
  {
    id: 'commercial-wizard',
    name: 'Commercial Wizard',
    description: 'Conjure up commercial ads that actually convert',
    url: 'https://ai-commercial-wizard-bs2oux2teq-uc.a.run.app/wizard',
    icon: 'building',
  },
  {
    id: 'planner-pulse',
    name: 'Planner Pulse',
    description: 'Newsletter vibes that keep planners in the loop',
    url: 'https://planner-pulse-279545860595.us-central1.run.app/',
    icon: 'calendar-heart',
  },
  {
    id: 'stay-in-the-loupe',
    name: 'Stay in the Loupe',
    description: 'Sparkling newsletter content for jewelers',
    url: 'https://stay-in-the-loupe-279545860595.us-central1.run.app/',
    icon: 'gem',
  },
  {
    id: 'venue-voice',
    name: 'Venue Voice',
    description: 'Content that makes every venue feel like the main event',
    url: 'https://venue-voice-279545860595.us-central1.run.app/',
    icon: 'home',
  },
  {
    id: 'video-ad-generator',
    name: 'Video Ad Generator',
    description: 'Snappy video clips that pack a punch',
    url: 'https://video-ad-generator-279545860595.us-central1.run.app/',
    icon: 'video',
  },
  {
    id: 'briteco-tool-1',
    name: 'New Tool Coming Soon',
    description: 'Exciting new BriteCo tool in development',
    url: '#',
    icon: 'plus',
    comingSoon: true,
  },
  {
    id: 'briteco-tool-2',
    name: 'New Tool Coming Soon',
    description: 'Exciting new BriteCo tool in development',
    url: '#',
    icon: 'plus',
    comingSoon: true,
  },
];
