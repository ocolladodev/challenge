export class Item {
    constructor(public name: string, public sellIn: number, public quality: number) {}
}

abstract class ItemStrategy {
    constructor(protected item: Item) {}

    update(): void {
        this.updateQuality();
        this.updateSellIn();
        this.handleExpired();
    }

    protected abstract updateQuality(): void;

    protected updateSellIn(): void {
        this.item.sellIn--;
    }

    protected handleExpired(): void {
        if (this.item.sellIn < 0) {
            this.updateExpiredQuality();
        }
    }

    protected updateExpiredQuality(): void {
        // Default behavior: do nothing
    }

    protected increaseQuality(amount: number = 1): void {
        this.item.quality = Math.min(50, this.item.quality + amount);
    }

    protected decreaseQuality(amount: number = 1): void {
        this.item.quality = Math.max(0, this.item.quality - amount);
    }
}

class NormalItemStrategy extends ItemStrategy {
    protected updateQuality(): void {
        this.decreaseQuality();
    }

    protected updateExpiredQuality(): void {
        this.decreaseQuality();
    }
}

class AgedBrieStrategy extends ItemStrategy {
    protected updateQuality(): void {
        this.increaseQuality();
    }

    protected updateExpiredQuality(): void {
        this.increaseQuality();
    }
}

class BackstagePassesStrategy extends ItemStrategy {
    protected updateQuality(): void {
        if (this.item.sellIn <= 0) {
            this.item.quality = 0;
        } else if (this.item.sellIn <= 5) {
            this.increaseQuality(3);
        } else if (this.item.sellIn <= 10) {
            this.increaseQuality(2);
        } else {
            this.increaseQuality();
        }
    }
}

class SulfurasStrategy extends ItemStrategy {
    protected updateQuality(): void {
        // Legendary item: quality does not change
    }

    protected updateSellIn(): void {
        // Legendary item: sellIn does not change
    }
}

class ConjuredItemStrategy extends ItemStrategy {
    protected updateQuality(): void {
        this.decreaseQuality(2);
    }

    protected updateExpiredQuality(): void {
        this.decreaseQuality(2);
    }
}

export class GildedRose {
    constructor(public items: Item[]) {}

    updateQuality(): Item[] {
        this.items.forEach(item => {
            const strategy = this.getStrategy(item);
            strategy.update();
        });
        return this.items;
    }

    private getStrategy(item: Item): ItemStrategy {
        if (item.name === "Aged Brie") return new AgedBrieStrategy(item);
        if (item.name === "Backstage passes to a TAFKAL80ETC concert") return new BackstagePassesStrategy(item);
        if (item.name === "Sulfuras, Hand of Ragnaros") return new SulfurasStrategy(item);
        if (item.name === "Conjured") return new ConjuredItemStrategy(item);
        return new NormalItemStrategy(item);
    }
}