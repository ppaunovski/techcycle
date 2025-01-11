export interface UserInteraction {
    interactionType: 'HOVER' | 'CLICKED' | 'ORDERED' | 'PUT_IN_CART' | 'REVIEWED',
    startDate: Date,
    endDate: Date,
    productId: number,
}

export const saveInteractions = (productId: number, interactionType: 'HOVER' | 'CLICKED' | 'ORDERED' | 'PUT_IN_CART' | 'REVIEWED', isLeave = false) => {
    const interactionsKey = "userInteractions";

    
    const storedInteractions = localStorage.getItem(interactionsKey);
    const interactions: UserInteraction[] = storedInteractions ? JSON.parse(storedInteractions) : [];

    if (interactionType === "HOVER") {
        if (!isLeave) {
            
            interactions.push({
                productId,
                interactionType: "HOVER",
                startDate: new Date(),
                endDate: new Date()
            });
        } else {
            
            const lastHoverInteraction = interactions
                .reverse()
                .find(
                    (interaction) => interaction.productId === productId && interaction.interactionType === "HOVER" && !interaction.endDate
                );

            if (lastHoverInteraction) {
                lastHoverInteraction.endDate = new Date();
            }
            interactions.reverse(); 
        }
    } else {
        
        interactions.push({
            productId,
            interactionType: interactionType,
            startDate: new Date(),
            endDate: new Date(),
        });
    }


    
    localStorage.setItem(interactionsKey, JSON.stringify(interactions));
};