import { DiscordIcon } from '../../../components/icons/DiscordIcon.tsx';
import { InstagramIcon } from '../../../components/icons/InstagramIcon.tsx';
import { GlobeIcon } from '../../../components/icons/GlobeIcon.tsx';

type SocialLinksProps = {
    discordUrl?: string;
    instagramUrl?: string;
    websiteUrl?: string;
};

export default function SocialLinks({ discordUrl, instagramUrl, websiteUrl }: SocialLinksProps) {
    return (
        <div className="flex gap-5">
            {discordUrl && (
                <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                    <DiscordIcon className="text-on-surface-variant" />
                </a>
            )}
            {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="text-on-surface-variant" />
                </a>
            )}
            {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    <GlobeIcon className="text-on-surface-variant" />
                </a>
            )}
        </div>
    );
}
