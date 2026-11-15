import { useCollections } from '@yanqirenshi/ihub.core';

// クラスのデータを、data/classes/classes.json (API の classes/classes) から、id で引く。
// クラスのページ (src/wbs/classes/P{id}.js) が、属性 (attributes)・振舞 (methods) を FrameClass に渡すのに使う。
// 見つからないときは、属性・メソッドが空のデータを返す。
export default function useClassData (id) {
    const collections = useCollections();
    const records = collections['classes/classes'] || [];

    return records.find(d=> String(d.id) === String(id))
        || { id, attributes: [], methods: [] };
}
