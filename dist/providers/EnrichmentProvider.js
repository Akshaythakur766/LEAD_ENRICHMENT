"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
class BaseProvider {
    createResult(data, confidence_score, source) {
        return {
            data,
            confidence_score,
            metadata: {
                provider: this.name,
                cost: this.cost,
                source: source || 'api_search'
            }
        };
    }
}
exports.BaseProvider = BaseProvider;
