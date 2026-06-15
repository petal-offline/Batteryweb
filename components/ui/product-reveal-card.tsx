"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Heart, MessageCircle, Star } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductFeature = {
  title: string;
  value: string;
};

interface ProductRevealCardProps {
  category?: string;
  stockStatus?: string;
  name?: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  features?: ProductFeature[];
  enquiryUrl?: string;
  detailsHref?: string;
  onFavorite?: () => void;
  enableAnimations?: boolean;
  className?: string;
}

function getDiscountPercentage(price: string, originalPrice: string) {
  const current = Number(price.replace(/[^\d.]/g, ""));
  const original = Number(originalPrice.replace(/[^\d.]/g, ""));

  if (!current || !original || current >= original) {
    return null;
  }

  return Math.round(((original - current) / original) * 100);
}

export function ProductRevealCard({
  category = "Battery Cell",
  stockStatus = "Contact for Quote",
  name = "Premium Wireless Headphones",
  price = "$199",
  originalPrice,
  image = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop",
  description = "Experience studio-quality sound with advanced noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
  rating = 4.8,
  reviewCount = 124,
  features = [
    { title: "30h Battery", value: "Long-lasting" },
    { title: "Noise Cancel", value: "Studio quality" }
  ],
  enquiryUrl = "https://wa.me/918799759565",
  detailsHref = "#contact",
  onFavorite,
  enableAnimations = true,
  className
}: ProductRevealCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const discountPercentage = originalPrice
    ? getDiscountPercentage(price, originalPrice)
    : null;
  const displayRating = Number.isInteger(rating) ? rating.toString() : rating.toFixed(1);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.();
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("a,button")) {
      return;
    }

    setIsRevealed((current) => !current);
  };

  const containerVariants: Variants = {
    rest: {
      scale: 1,
      y: 0,
      filter: "blur(0px)"
    },
    hover: shouldAnimate
      ? {
          scale: 1.03,
          y: -8,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }
        }
      : {}
  };

  const imageVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 }
  };

  const overlayVariants: Variants = {
    rest: {
      y: "100%",
      opacity: 0,
      filter: "blur(4px)"
    },
    hover: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const contentVariants: Variants = {
    rest: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5
      }
    }
  };

  const buttonVariantsMotion: Variants = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate
      ? {
          scale: 1.05,
          y: -2,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
          }
        }
      : {},
    tap: shouldAnimate ? { scale: 0.95 } : {}
  };

  const favoriteVariants: Variants = {
    rest: { scale: 1, rotate: 0 },
    favorite: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      data-slot="product-reveal-card"
      initial="rest"
      animate={isRevealed ? "hover" : "rest"}
      whileHover="hover"
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      onFocus={() => setIsRevealed(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsRevealed(false);
        }
      }}
      onClick={handleCardClick}
      variants={containerVariants}
      tabIndex={0}
      className={cn(
        "group relative w-80 cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-900",
        "shadow-[0_20px_60px_rgba(15,23,42,0.10)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40",
        className
      )}
    >
      <div className="relative overflow-hidden bg-slate-100">
        <motion.img
          src={image}
          alt={name}
          className="h-56 w-full object-cover"
          variants={imageVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/38 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-md border border-white/20 bg-slate-950/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {category}
          </span>
          <span className="rounded-md border border-white/20 bg-white/18 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {stockStatus}
          </span>
        </div>

        <motion.button
          type="button"
          onClick={handleFavorite}
          variants={favoriteVariants}
          animate={isFavorite ? "favorite" : "rest"}
          aria-label={isFavorite ? "Remove from shortlist" : "Add to shortlist"}
          className={cn(
            "absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white shadow-lg backdrop-blur-md transition-colors",
            isFavorite ? "bg-red-500" : "bg-slate-950/35 hover:bg-slate-950/50"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </motion.button>

        {discountPercentage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white"
          >
            {discountPercentage}% OFF
          </motion.div>
        )}
      </div>

      <div className="space-y-3 p-6">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(rating)
                    ? "fill-current text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {displayRating} ({reviewCount} reviews)
          </span>
        </div>

        <div className="space-y-1">
          <motion.h3
            className="text-xl font-extrabold leading-tight tracking-normal text-slate-900"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-primary">{price}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.div
        data-slot="product-reveal-overlay"
        variants={overlayVariants}
        className="product-reveal-overlay absolute inset-0 flex flex-col justify-end text-white"
      >
        <div className="space-y-4 p-6">
          <motion.div variants={contentVariants}>
            <h4 className="mb-2 text-base font-bold">Product Details</h4>
            <p className="text-sm leading-relaxed text-white/88">
              {description}
            </p>
          </motion.div>

          <motion.div variants={contentVariants}>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {features.slice(0, 2).map((feature) => (
                <div
                  className="rounded-lg border border-white/10 bg-white/10 p-2 text-center"
                  key={`${name}-${feature.title}`}
                >
                  <div className="font-semibold text-white">{feature.title}</div>
                  <div className="mt-0.5 text-white/86">{feature.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={contentVariants} className="space-y-3">
            <motion.a
              href={enquiryUrl}
              target="_blank"
              rel="noreferrer"
              variants={buttonVariantsMotion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-12 w-full bg-gradient-to-r from-emerald-600 to-primary font-bold shadow-lg shadow-primary/25 hover:from-emerald-700 hover:to-primary"
              )}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Enquire
            </motion.a>

            <motion.a
              href={detailsHref}
              variants={buttonVariantsMotion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 w-full border-white bg-white font-bold text-slate-950 shadow-sm hover:bg-slate-100 hover:text-slate-950"
              )}
            >
              View Details
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
