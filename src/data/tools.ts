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
    id: 'commercial-wizard',
    name: 'Commercial Wizard',
    description: 'Generate commercial insurance quotes and proposals',
    url: 'https://ai-commercial-wizard-bs2oux2teq-uc.a.run.app/wizard',
    icon: 'building',
  },
  {
    id: 'briteco-brief',
    name: 'BriteCo Brief',
    description: 'Create concise briefs and summaries',
    url: 'https://briteco-brief-279545860595.us-central1.run.app/',
    icon: 'file-text',
  },
  {
    id: 'planner-pulse',
    name: 'Planner Pulse',
    description: 'Support wedding planners with insurance solutions',
    url: 'https://planner-pulse-279545860595.us-central1.run.app/',
    icon: 'calendar-heart',
  },
  {
    id: 'venue-voice',
    name: 'Venue Voice',
    description: 'Customize venue insurance communications',
    url: 'https://venue-voice-279545860595.us-central1.run.app/',
    icon: 'home',
  },
  {
    id: 'ad-generator',
    name: 'Ad Generator',
    description: 'Create targeted ad campaigns',
    url: 'https://ad-generator-279545860595.us-central1.run.app/',
    icon: 'megaphone',
  },
  {
    id: 'video-ad-generator',
    name: 'Video Ad Generator',
    description: 'Generate bite-sized video ads',
    url: 'https://video-ad-generator-279545860595.us-central1.run.app/',
    icon: 'video',
  },
  {
    id: 'stay-in-the-loupe',
    name: 'Stay in the Loupe',
    description: 'Jewelry industry insights and updates',
    url: '#',
    icon: 'gem',
    comingSoon: true,
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
