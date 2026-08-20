-- ==============================================================================
-- SUPABASE STORAGE RLS POLICIES FOR "reference-images" BUCKET
-- Execute estas instruções no SQL Editor do seu projeto Supabase
-- ==============================================================================

-- 1. Criar o bucket se ainda não existir (público para permitir leitura dos links no email)
insert into storage.buckets (id, name, public)
values ('reference-images', 'reference-images', true)
on conflict (id) do nothing;

-- 2. Permitir upload público (anônimo) para o bucket reference-images
create policy "Allow public uploads to reference-images"
on storage.objects for insert
to anon
with check (bucket_id = 'reference-images');

-- 3. Permitir leitura pública dos arquivos do bucket reference-images
create policy "Allow public read of reference-images"
on storage.objects for select
to anon
using (bucket_id = 'reference-images');

-- Observação: Não foram criadas políticas de UPDATE ou DELETE para anon (apenas insert e select).
