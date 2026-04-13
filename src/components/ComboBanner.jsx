import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { COMBO_SIZE } from '../utils/products';

const ComboBanner = () => {
  const { totalQuantity, hasCombo, savings, combos } = useCart();
  const remaining = COMBO_SIZE - (totalQuantity % COMBO_SIZE);
  const nextComboProgress = totalQuantity % COMBO_SIZE;

  if (totalQuantity === 0) return null;

  return (
    <div className={`border ${hasCombo ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-yellow-800/30 bg-yellow-900/5'} p-4 my-4`}>
      {hasCombo ? (
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-yellow-400 mt-0.5 shrink-0 animate-pulse" />
          <div>
            <p className="font-body text-sm text-yellow-400 font-bold tracking-wide">
              🎉 Combo Applied! {combos} × 3-pack deal active
            </p>
            <p className="font-body text-xs text-yellow-600/70 mt-0.5">
              You're saving <span className="text-yellow-400 font-bold">₹{savings}</span> with our combo offer!
              {remaining < COMBO_SIZE && ` Add ${remaining} more for another combo.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-yellow-700 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-body text-sm text-yellow-600 tracking-wide">
              Add {remaining} more item{remaining > 1 ? 's' : ''} to unlock the Combo Deal (3 for ₹250)
            </p>
            <div className="mt-2 h-1 bg-yellow-900/30 rounded-full overflow-hidden">
              <div
                className="h-full gold-gradient rounded-full transition-all duration-500"
                style={{ width: `${(nextComboProgress / COMBO_SIZE) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-body text-[10px] text-yellow-900/50">{nextComboProgress}/3 items</span>
              <span className="font-body text-[10px] text-yellow-600/60">Save ₹50 with combo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboBanner;
