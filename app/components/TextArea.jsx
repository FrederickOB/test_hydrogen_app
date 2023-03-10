import clsx from 'clsx';
import { Heading } from './Text';

export function TextArea({ className = '', type, variant, label, ...props }) {
    const variants = {
        search:
            'bg-transparent px-0 py-2 text-heading w-full focus:ring-0 border-x-0 border-t-0 transition border-b-2 border-primary/10 focus:border-primary/90',
        minisearch:
            'bg-transparent hidden md:inline-block text-left lg:text-right border-b transition border-transparent -mb-px border-x-0 border-t-0 appearance-none px-0 py-1 focus:ring-transparent placeholder:opacity-20 placeholder:text-inherit',
    };

    const styles = clsx(variants[variant], className);

    return (<><Heading as="legend" size="lead" className="min-w-[4rem]">
        {label}
    </Heading>
        <textarea rows="4" cols="50"  {...props} className={styles} />
    </>);
}
