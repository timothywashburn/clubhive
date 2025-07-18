import { useClubState, useTabIndicator, useMyClubsData } from './hooks';
import {
    ClubSelector,
    ClubHeader,
    TabNavigation,
    MemberInfo,
    OfficerInfo,
    Events,
    EventPlanner,
    Stats,
    Membership,
    EmptyState,
} from './components';

export function MyClubs() {
    const { clubs, events } = useMyClubsData();

    const { selectedClub, setSelectedClub, activeTab, setActiveTab, isPreviewMode, setIsPreviewMode, isOfficer, isOwner, showOfficerView } =
        useClubState();

    const { indicatorStyle, shouldAnimate, setShouldAnimate, tabRefs } = useTabIndicator(activeTab, selectedClub, isPreviewMode);

    const renderTabContent = () => {
        const contentKey = `${selectedClub?.id}-${activeTab}-${isPreviewMode}`;

        if (!selectedClub) return null;

        let content = null;
        if (activeTab === 'info') {
            content = showOfficerView ? <OfficerInfo club={selectedClub} /> : <MemberInfo club={selectedClub} />;
        } else if (activeTab === 'events') {
            content = showOfficerView ? <EventPlanner events={events} /> : <Events events={events} />;
        } else if (activeTab === 'stats' && showOfficerView) {
            content = <Stats club={selectedClub} />;
        } else if (activeTab === 'stats' && isPreviewMode) {
            setActiveTab('info');
            content = showOfficerView ? <OfficerInfo club={selectedClub} /> : <MemberInfo club={selectedClub} />;
        } else if (activeTab === 'membership') {
            content = <Membership club={selectedClub} isOwner={isOwner} />;
        }

        return (
            <div key={contentKey} className="min-h-0">
                {content}
            </div>
        );
    };

    return (
        <div className="h-full relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    <div className="w-80 flex-shrink-0">
                        <ClubSelector clubs={clubs} selectedClub={selectedClub} onClubSelect={setSelectedClub} />
                    </div>

                    <div className="flex-1 min-w-0">
                        {selectedClub ? (
                            <div className="space-y-6">
                                <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                                    <ClubHeader
                                        club={selectedClub}
                                        isOfficer={isOfficer}
                                        isPreviewMode={isPreviewMode}
                                        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
                                    />

                                    <TabNavigation
                                        showOfficerView={showOfficerView}
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                        indicatorStyle={indicatorStyle}
                                        shouldAnimate={shouldAnimate}
                                        tabRefs={tabRefs}
                                        setShouldAnimate={setShouldAnimate}
                                    />
                                </div>

                                {renderTabContent()}
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
