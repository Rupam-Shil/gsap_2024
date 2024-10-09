/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useEffect, useRef } from 'react';
import styles from './page.module.scss';
import { LINKS } from '@/constants/links.contants';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

const circleRadius = 1100;

function page() {
	const cursor = useRef<HTMLDivElement>(null);
	const gallery = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const imageCleanUpListener = (index: number) => () => {
		const imgs = cursor.current?.querySelectorAll('img');
		if (imgs?.length) {
			const lastImg = imgs[imgs.length - 1];
			[...imgs].forEach((img) => {
				if (img !== lastImg) {
					gsap.to(img, {
						clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
						duration: 1,
						ease: 'power3.out',
						onComplete: () => {
							setTimeout(() => {
								img.remove();
							}, 1000);
						},
					});
				}
			});
			gsap.to(lastImg, {
				clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
				duration: 1,
				ease: 'power3.out',
				delay: 0.25,
			});
		}
	};

	const imageListener = (index: number) => (e: MouseEvent) => {
		const imgSrc = `/page/page-${index % 2}.jpg`;
		const img = document.createElement('img');
		img.src = imgSrc;
		img.classList.add(styles.img);
		img.style.clipPath = `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`;
		cursor.current?.appendChild(img);
		gsap.to(img, {
			clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
			duration: 1,
			ease: 'power3.out',
		});
		e.currentTarget?.addEventListener('mouseout', imageCleanUpListener(index));
	};

	const handleCircleGeneration = (): HTMLDivElement[] => {
		const itemsCount = LINKS.length;
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		const angleStep = (2 * Math.PI) / itemsCount;
		const items: HTMLDivElement[] = [];

		for (let i = 0; i < itemsCount; i++) {
			const item = document.createElement('div');
			item.classList.add(styles.item);
			const p = document.createElement('p');
			p.textContent = LINKS[i].name;
			const span = document.createElement('span');
			span.textContent = `(${i + 1})`;
			item.appendChild(p);
			p.appendChild(span);
			item.onclick = () => {
				router.push(LINKS[i].link);
			};

			const angle = i * angleStep;
			const x = centerX + circleRadius * Math.cos(angle);
			const y = centerY + circleRadius * Math.sin(angle);

			const rotation = angle * (180 / Math.PI);

			gsap.set(item, {
				x: x + 'px',
				y: y + 'px',
				rotation: rotation + 'deg',
			});
			gallery.current?.appendChild(item);
			item.addEventListener('mouseover', imageListener(i));

			items.push(item);
		}
		return items;
	};

	useEffect(() => {
		const items = handleCircleGeneration();
		document.addEventListener('scroll', updateScroll);
		document.addEventListener('mousemove', followCursor);
		updateScroll();
		return () => {
			document.removeEventListener('scroll', updateScroll);
			document.removeEventListener('mousemove', followCursor);
			items.forEach((item, i) => {
				item.removeEventListener('mouseover', imageListener(i));
				item.removeEventListener('mouseout', imageCleanUpListener(i));
			});
		};
	}, [cursor, gallery]);

	const updateScroll = () => {
		const scrollAmount = window.scrollY * 0.0002;
		const angleIncrement = (2 * Math.PI) / LINKS.length;
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		document.querySelectorAll(`.${styles.item}`).forEach((item, index) => {
			const angle = index * angleIncrement - scrollAmount;
			const x = centerX + circleRadius * Math.cos(angle);
			const y = centerY + circleRadius * Math.sin(angle);
			const rotation = angle * (180 / Math.PI);
			gsap.to(item, {
				x: x + 'px',
				y: y + 'px',
				rotation: rotation + 'deg',
				duration: 0.05,
				ease: 'elastic.out(1, 0.3)',
			});
		});
	};

	const followCursor = (e: MouseEvent) => {
		gsap.to(cursor.current, {
			x: e.clientX - 150,
			y: e.clientY - 200,
			duration: 1,
			ease: 'power3.out',
		});
	};

	return (
		<section className={styles.page}>
			<div className={styles.cursor} ref={cursor}></div>
			<nav className={styles.nav}>
				<a href="/">Animations</a>
			</nav>
			<div className={styles.container}>
				<div className={styles.gallery} ref={gallery}></div>
			</div>
		</section>
	);
}

export default page;
