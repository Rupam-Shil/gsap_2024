import React from 'react';
import styles from '@/app/page.module.scss';
function CircleItem({
	index,
	link,
	name,
}: {
	index: number;
	link: string;
	name: string;
}) {
	return (
		<div className={styles.item}>
			<p>
				{name} <span>({index + 1})</span>
			</p>
		</div>
	);
}

export default CircleItem;
